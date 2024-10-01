import {
	scores,
	analyses,
	manNames,
	running,
	runInfo,
	selManID,
	states,
	isCompFlight,
	bin,
	origin,
	selectedResult,
	difficulty,
	truncate,
	fa_versions,
	binData
} from '$lib/stores';
import { MA } from '$lib/ma';
import { AnalysisExport, MAExport } from '$lib/analysis_export';
import { serverFunc } from '$lib/api_calls';
import { States } from '$lib/state';
import { FCJson, type FCJMan, ScheduleInfo } from '$lib/fcjson';
import { get } from 'svelte/store';
import { base } from '$app/paths';
import { fcj } from '$lib/stores';
import { Manoeuvre } from '$lib/manoeuvre';
import pkg from 'file-saver';
import { ManDef } from './mandef';
import { ManoeuvreResult } from './scores';
import { writable, type Writable } from 'svelte/store';

const { saveAs } = pkg;

export function createAnalyses(mnames: string[]) {
	manNames.set(mnames);
	scores.set(new Array(mnames.length).fill(0));

	mnames.forEach((name, i) => {
		analyses.push(writable());
		running.push(writable(false));
		runInfo.push(writable(`Empty Analysis Created At ${new Date().toLocaleTimeString()}`));

		analyses[i].subscribe((value) => {
			scores.update((s) => {
				if (value) {
					s[i] =
						value.get_score(get(selectedResult), get(difficulty), get(truncate)).total *
						(value.mdef?.info?.k | value.k);
				} else {
					s[i] = 0;
				}
				return s;
			});

			fa_versions.update((v) => {
				return [...new Set([...v, ...Object.keys(value?.history || [])])];
			});
		});
	});
}

export function clearAnalysis() {
	selManID.set(undefined);
	states.set(undefined);
	manNames.set(undefined);
	scores.set(undefined);
	selectedResult.set(undefined);
	fa_versions.set([]);
	binData.set(undefined);
	origin.set(undefined);
	fcj.set(undefined);
	bin.set(undefined);
	analyses.length = 0;
	running.length = 0;
	runInfo.length = 0;
}

export async function createAnalysisExport(small: boolean = false) {
	return {
		origin: get(origin),
		isComp: get(isCompFlight),
		sourceBin: get(bin)?.name || undefined,
		sourceFCJ: get(fcj)?.name || undefined,
		mans: analyses.map((_ma) => (small ? get(_ma).smallexport() : get(_ma)))
	};
}

export async function exportAnalysis() {
	saveAs(
		new Blob([JSON.stringify(await createAnalysisExport())], { type: 'application/json' }),
		`${get(bin)?.name.replace('.BIN', '') || get(fcj)?.name.replace('.json', '') || 'exported'}_analysis.json`
	);
}

export async function importAnalysis(data: Record<string, any>) {
	clearAnalysis();
	origin.set(data.origin);
	isCompFlight.set(data.isComp);

	createAnalyses(data.mans.map((ma) => ma.name));

	data.mans.forEach((ma, i) => {
		analyses[i].set(MA.parse(ma));
	});
}

export async function loadExample() {
	clearAnalysis();
  importAnalysis(await (await fetch(`${base}/example/example_analysis.json`)).json());
	
}

export async function analyseMans(ids: number[], optim: boolean, force: boolean) {
	ids.forEach(async (id) => {
		await analyseManoeuvre(id, optim, force);
	});
}

export async function analyseAll(optim: boolean, force: boolean) {
	analyses.forEach(async (ma, i) => {
		await analyseManoeuvre(i, optim, force);
	});
}

export async function analyseManoeuvre(id: number, optimise: boolean, force: boolean) {
	const ma = get(analyses[id]);
	if ((!ma.scores || force) && !get(running[id])) {
		runInfo[id].set(`Running analysis at ${new Date().toLocaleTimeString()}`);
		running[id].set(true);

		await ma.run(optimise).then((res) => {
			analyses[id].set(res);
			running[id].set(false);
		});
	}
}

export async function checkFCJ(fcjson: FCJson) {
	let matches = true;
	analyses.forEach(async (ma, i) => {
		if (fcjson.mans[i + 1].start != get(ma).tStart || fcjson.mans[i + 1].stop != get(ma).tStop) {
			matches = false;
		}
	});
	return matches;
}

export async function exportFCJ(oldfcj: FCJson) {
	if (checkFCJ(oldfcj)) {
		analyses.forEach(async (ma, i) => {
			Object.entries(get(ma).history).forEach(([key, value]) => {
				oldfcj.add_result_id(key, i + 1, value);
			});
		});

		saveAs(
			new Blob([JSON.stringify(oldfcj.export_data())], { type: 'application/json' }),
			oldfcj.name
		);
	}
}

export async function listCategories() {
	return await serverFunc('categories', {}, 'GET');
}

export async function listSchedules(category: string) {
	return (await serverFunc(`${category}/schedules`, {}, 'GET')).schedules;
}

export async function listManoeuvres(category: string, schedule: string) {
	return await serverFunc(`${category}/${schedule}/manoeuvres`, {}, 'GET');
}

export async function parseFCJMans(fcj: FCJson, offset: number) {
	const sdets = await listManoeuvres(
		fcj.sinfo.category.replaceAll(' ', '_'),
		fcj.sinfo.name.replaceAll(' ', '_')
	);

	return fcj.mans.map((man: FCJMan, i: number) => {
		let serverMan;
		switch (i) {
			case 0:
				serverMan = 'Takeoff';
				break;
			case fcj.mans.length - 1:
				serverMan = 'Landing';
				break;
			default:
				serverMan = sdets.manoeuvres[i - 1];
		}
		return {
			category: i == 0 || i == fcj.mans.length - 1 ? undefined : sdets.category,
			schedule: i == 0 || i == fcj.mans.length - 1 ? undefined : sdets.schedule,
			manoeuvre: serverMan,
			id: i,
			stop: man.stop + offset
		};
	});
}

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
	truncate
} from '$lib/stores';
import { MA } from '$lib/api_objects/ma';
import { AnalysisExport, MAExport } from '$lib/analysis_export';
import { serverFunc } from '$lib/api_calls';
import { States } from '$lib/geometry';
import { FCJson, type FCJMan, ScheduleInfo } from '$lib/api_objects/fcjson';
import { get } from 'svelte/store';
import { base } from '$app/paths';
import { fcj } from '$lib/stores';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';
import { dev } from '$app/environment';
import pkg from 'file-saver';
import { ManDef } from './api_objects/mandef';
import { ManoeuvreResult } from './api_objects/scores';
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
					selectedResult.set(Object.keys(value.history)[Object.keys(value.history).length - 1]);
				} else {
					s[i] = 0;
				}
				return s;
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
	analyses.length = 0;
	running.length = 0;
	runInfo.length = 0;
}

export async function loadExample() {
	clearAnalysis();
	const _fcj = FCJson.parse(await (await fetch(`${base}/example/example_fcjson.json`)).json());

	createAnalyses(_fcj.unique_names.slice(1, _fcj.unique_names.length - 1));

	const sts = States.parse(await (await fetch(`${base}/example/example_state.json`)).json());
	const fcjoffset = sts.getFCJIndexOffset();
	if (dev) {
		states.set(sts);
	}

	get(manNames).forEach(async (name, i) => {
		fetch(`${base}/example/${name}.json`).then(async (res) => {
			res.json().then((data) => {
				analyses[i].set(
					new MA(
						name,
						i + 1,
						_fcj.mans[i + 1].start + fcjoffset,
						_fcj.mans[i + 1].stop + fcjoffset,
						new ScheduleInfo('f3a', 'p25'),
						'RighttoLeft',
						States.parse(data.flown),
						_fcj.manhistory(i + 1),
						data.mdef.info.k,
						ManDef.parse(data.mdef),
						Manoeuvre.parse(data.manoeuvre),
						States.parse(data.template),
						Manoeuvre.parse(data.corrected),
						States.parse(data.corrected_template),
						ManoeuvreResult.parse(data.full_scores)
					)
				);
			});
		});
	});
}

export async function createAnalysisExport() {
	return new AnalysisExport(
		get(origin),
		get(isCompFlight),
		get(bin)?.name || undefined,
		get(fcj)?.name || undefined,
		analyses.map((_ma, i) => {
			const ma = get(_ma);
			return new MAExport(ma.name, ma.id, ma.schedule, ma.start, ma.stop, ma.k, ma.history);
		}),
		get(states)
	);
}

export async function exportAnalysis() {
	saveAs(
		new Blob([JSON.stringify(await createAnalysisExport())], { type: 'application/json' }),
		`${get(bin)?.name || get(fcj)?.name || 'exported'}_analysis.json`
	);
}

export async function importAnalysis(aE: AnalysisExport) {
  clearAnalysis();
  origin.set(aE.box);
  isCompFlight.set(aE.isComp);
  states.set(aE.states);


  createAnalyses(aE.mans.map((mae) => mae.name));

  aE.mans.forEach((mae, i) => {
    analyses[i].set(new MA(
      mae.name, mae.id, mae.start, mae.stop, 
      mae.sinfo, aE.direction(), 
      new States(aE.states.data.slice(mae.start, mae.stop + 1)),
      mae.history,
      mae.k,
    ));
  });
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


export async function exportFCJ() {
	saveAs(
		new Blob([JSON.stringify(get(fcj)!.export_data())], { type: 'application/json' }),
		get(fcj)!.name
	);
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

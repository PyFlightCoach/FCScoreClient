import {
	internals,
	direction,
	fcj,
	selectedResult,
	activeManoeuvre,
	running,
	fa_version,
    optimise, long_output, runInfo
} from '$lib/stores';
import { Internals } from '$lib/api_objects/mandata';
import { serverFunc } from '$lib/api_calls';
import { browser } from '$app/environment';
import { FCJManResult, FCJson } from '$lib/api_objects/fcjson';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import pkg from 'file-saver';
const { saveAs } = pkg;


export function clearFlight(target: string | null = null) {
	internals.set(undefined);
	direction.set(undefined);
	fcj.set(undefined);
	selectedResult.set(undefined);
	activeManoeuvre.set(undefined);
	if (browser && target !== null) {
		goto(target || base);
	}
}

export async function analyseManoeuvre(
	name: string,
	force: boolean = false,
	optim: boolean | null = null,
	long = false,
	source_result: string | null = null
) {
	const _fcj = get(fcj)!;
	const manid = _fcj!.unique_names.indexOf(name);

	if (
		!get(running).includes(name) &&
		(!_fcj.get_result(get(fa_version))?.manresults[manid] || force)
	) {
		running.update((v) => {
			v.push(name);
			return v;
		});

		const internal_data = get(internals)![manid];

		const props: Record<string, any> = {
			id: manid - 1,
			direction: get(direction)!,
			optimise_alignment: optim === null ? get(optimise) : optim,
			long_output: long || get(long_output),
			difficulty: 'all',
			truncate: 'both'
		};

		let method: string = 'run_short_manoeuvre';
		if (internal_data && internal_data.fa_version == source_result) {
			props.mdef = internal_data.mdef;
			props.flown = internal_data.flown.data;

			method = 'run_long_manoeuvre';
		} else {
			props.sinfo = _fcj!.sinfo;
			props.site = _fcj!.origin;
			props.data = _fcj!.get_mandata(manid);
			if (_fcj.get_result(source_result!)?.manresults[manid]?.els) {
				props.els = _fcj.get_result(source_result!)?.manresults[manid]?.els;
			}
		}

		try {
			const res = await serverFunc(method, props);

			fcj.update((v) => {
				v?.add_result(res.fa_version || get(fa_version), name, FCJManResult.parse(res));
				return v;
			});
			selectedResult.set(undefined);
			selectedResult.set(res.fa_version || get(fa_version));

			if (Object.keys(res).includes('mdef')) {
				if (Object.keys(res).includes('fa_version')) {
					internals.update((v) => {
						v![manid] = Internals.parse(res);
						return v;
					});
				} else {
					console.log(`Cant display internals for version ${get(fa_version)}`);
				}
			}
			runInfo.update((v) => {
				v[name] = `Run at ${new Date().toLocaleString()}`;
				return v;
			});
		} catch (err) {
			runInfo.update((v) => {
				v[name] = `Error: ${err.message}`;
				return v;
			});

			console.log('Error running manoeuvre ' + name + ': ' + err.message);
		}

		running.update((v) => v.filter((item) => item !== name));
	}
}

export async function analyseList(
	names: string[],
	force = false,
	optim: boolean | null = null,
	internals: boolean = false
) {
	const source_result = get(selectedResult);
	names.forEach(async (name) => {
		await analyseManoeuvre(name, force, optim, internals, source_result);
	});
}

export async function loadExample() {
	fcj.set(FCJson.parse(await (await fetch(`${base}/example/example_p25.json`)).json()));
	direction.set(1);
	const _fcj = get(fcj)!;
	selectedResult.set(_fcj.fcs_scores[_fcj.fcs_scores.length - 1].fa_version);
	internals.set(Array(_fcj.mans.length));
	_fcj.unique_names.forEach((name, i) => {
		Internals.parse_example(name).then((data) => {
			internals.update((v) => {
				v![i] = data;
				return v;
			});
		});
	});

	runInfo.set(
		Object.fromEntries(
			_fcj.unique_names.map((mn) => {
				return [mn, `Example loaded at ${new Date().toLocaleString()}`];
			})
		)
	);
}

export async function exportFCJ() {
	saveAs(
		new Blob([JSON.stringify(get(fcj)!.export_data())], { type: 'application/json' }),
		get(fcj)!.name
	);
}


export async function listCategories() {
	return await serverFunc('categories', {}, 'GET')
}

export async function listSchedules(category: string) {
	return await serverFunc(`${category}/schedules`, {}, 'GET')
}

export async function listManoeuvres(category: string, sName: string) {
	return await serverFunc(`${category}/${sName}/manoeuvre_names`, {}, 'GET')
}
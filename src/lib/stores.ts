import { writable, type Writable } from 'svelte/store';
import { serverFunc } from '$lib/api_calls';
import { FCJson, Origin, ScheduleInfo } from '$lib/api_objects/fcjson';
import { MA } from '$lib/api_objects/mandata';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { ManDetails } from '$lib/splitter/splitting';

export class NavContent {
	constructor(
		readonly name: string,
		readonly href: string,
		readonly onclick = () => {}
	) {}
}

export const navitems: Writable<NavContent[]> = writable([]);

export const server = writable(
	browser
		? localStorage.getItem('server') || 'https://madeupmodels.com:5010'
		: 'https://madeupmodels.com:5010'
);
server.subscribe((value) => {
	if (browser) {
		localStorage.setItem('server', value);
	}
});

export const fa_version: Writable<string> = writable('not connected to server');
server.subscribe(async () => {
	try {
		fa_version.set(await serverFunc('fa_version', {}, 'GET'));
	} catch (err) {
		fa_version.set(err.message);
	}
});

export const server_version: Writable<string> = writable('not connected to server');
server.subscribe(async () => {
	try {
		server_version.set(await serverFunc('version', {}, 'GET'));
	} catch (err) {
		server_version.set(err.message);
	}
});

export const custom_server = writable(
	(browser && localStorage.getItem('custom_server')) || 'http://localhost:5000'
);
custom_server.subscribe((value) => {
	if (browser) {
		localStorage.setItem('custom_server', value);
	}
});
export const optimise = writable<boolean>(
	browser ? localStorage.getItem('optimise') === 'true' : true
);
optimise.subscribe((value) => {
	if (browser) {
		localStorage.optimise = String(value);
	}
});

export const mouse = writable({ x: 0, y: 0 });

export const isCompFlight: Writable<boolean> = writable(true);
export const bin: Writable<File> = writable();
export const binData: Writable<Record<string, any>> = writable({});
export const origin: Writable<Origin | undefined> = writable();
export const fcj: Writable<FCJson | undefined> = writable();

export const manNames: Writable<string[]> = writable();
export const analyses: Writable<MA | undefined>[] = [];
export const running: Writable<boolean>[] = [];
export const runInfo: Writable<string>[] = [];
export const scores: Writable<number[]> = writable();
export const totalScore: Writable<string> = writable('---');

export const selectedResult: Writable<string | undefined> = writable();
export const difficulty: Writable<number> = writable(3);
export const truncate: Writable<boolean> = writable(false);
export const selManID: Writable<number | undefined> = writable();

scores.subscribe((value) => {
	totalScore.set(value ? value.reduce((a, b) => a + b, 0).toFixed(2) : '---');
});

export function createAnalyses(mnames: string[]) {
	manNames.set(mnames);
	scores.set(new Array(mnames.length).fill(0));

	mnames.forEach((name, i) => {
		analyses.push(writable());
		running.push(writable(false));
		runInfo.push(writable(`Analysis Created At ${new Date().toLocaleTimeString()}`));

		analyses[i].subscribe((value) => {
			scores.update((s) => {
				if (value) {
					s[i] =
						value.get_score(get(selectedResult), get(difficulty), get(truncate)).total *
						(value.mdef?.info.k | value.k);
					selectedResult.set(Object.keys(value.history)[Object.keys(value.history).length - 1]);
				} else {
					s[i] = 0;
				}
				return s;
			});
		});
	});
}

function updateScores(result: string, diff: number, trunc: boolean) {
	scores.set(
		analyses.map((a) => {
			const ma = get(a);
			return ma ? ma.get_score(result, diff, trunc).total * (ma.mdef?.info.k | ma.k) : 0;
		})
	);
}

selectedResult.subscribe((value) => {
	updateScores(value, get(difficulty), get(truncate));
});

difficulty.subscribe((value) => {
	updateScores(get(selectedResult), value, get(truncate));
});

truncate.subscribe((value) => {
	updateScores(get(selectedResult), get(difficulty), value);
});

export function clearAnalysis(target: string = undefined) {
	selManID.set(undefined);
	manNames.set(undefined);
	scores.set(undefined);
	selectedResult.set(undefined);
	analyses.length = 0;
	running.length = 0;
	runInfo.length = 0;
}

fcj.subscribe((value) => {
	if (value?.fcs_scores.length > 0) {
		selectedResult.set(value.fcs_scores[value.fcs_scores.length - 1].fa_version);
	} else {
		selectedResult.set(undefined);
	}
});



export const manoeuvres: Writable<Record<string, ManDetails[]>> = writable({});
export const schedules: Writable<Record<string, string[]>> = writable({});
export const categories: Writable<string[]> = writable([]);

export async function loadCategories() {
	if (get(categories).length==0) {
		categories.set(await serverFunc('categories', {}, 'GET'));
	}
	return get(categories);
}

export async function loadSchedules(category: string) {
	if (!schedules[category]) {
		await serverFunc(`${category}/schedules`, {}, 'GET').then((res) => {
			schedules.update((s) => {
				s[category] = res;
				return s;
			});
		});
	}
	return get(schedules)[category];
}

export async function loadManoeuvres(category: string, schedule: string) {
	const sinfo = new ScheduleInfo(category, schedule);

	if (!manoeuvres[sinfo.to_string()]) {
		await serverFunc(`${category}/${schedule}/manoeuvres`, {}, 'GET').then(pfcMans => {
			manoeuvres.update(mans => {
				mans[`${category}_${schedule}`] = pfcMans.map(
					(m) => new ManDetails(m.name, m.id, m.k, sinfo)
				);
				return mans;
			});
		});
	}
	return get(manoeuvres)[sinfo.to_string()];
}

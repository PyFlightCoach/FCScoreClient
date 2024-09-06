import { writable, type Writable, get } from 'svelte/store';
import { serverFunc } from '$lib/api_calls';
import { FCJson, FCSResult, Origin } from '$lib/api_objects/fcjson';
import { Internals } from '$lib/api_objects/mandata';

import { browser } from '$app/environment';
import _ from 'underscore';

export const fcj: Writable<FCJson | undefined> = writable();
export const direction: Writable<number | undefined> = writable();
export const internals: Writable<Internals[] | undefined> = writable();
export const running: Writable<string[]> = writable([]);

export const runInfo: Writable<Record<string, string>> = writable();

export const server_version: Writable<string> = writable('not connected to server');
export const fa_version: Writable<string> = writable('not connected to server');

export const selectedResult: Writable<string | undefined> = writable();
export const activeResult: Writable<FCSResult | undefined> = writable();
selectedResult.subscribe((value) => {
	activeResult.set(get(fcj)?.get_result(value));
});

export const activeManoeuvre: Writable<string | undefined> = writable();

export const difficulty: Writable<number> = writable(3);
export const truncate: Writable<boolean> = writable(false);

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

server.subscribe(async () => {
	try {
		fa_version.set(await serverFunc('fa_version', {}, 'GET'));
	} catch (err) {
		fa_version.set(err.message);
	}
});

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
export const long_output = writable<boolean>(
	browser ? localStorage.getItem('long_output') === 'true' : false
);
long_output.subscribe((value) => {
	if (browser) {
		localStorage.long_output = String(value);
	}
});

export const mouse = writable({ x: 0, y: 0 });


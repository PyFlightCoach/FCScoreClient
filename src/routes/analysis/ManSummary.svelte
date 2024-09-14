<script lang="ts">
	import { selManID, selectedResult, difficulty, truncate, optimise, running, runInfo } from '$lib/stores';
	import { colscale, redsColors, tealsColrs, yellColors } from '$lib/plots/styling';
	import {analyseManoeuvre} from '$lib/analysis';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { analyses } from '$lib/stores';

	export let id: number;

	let ma = analyses[id];

	let isRunning = running[id];
	let info = runInfo[id];
	
	$: colours = [yellColors, tealsColrs, redsColors][$difficulty - 1];

	$: scores = $ma?.get_score($selectedResult, $difficulty, $truncate);
	$: intra = scores?.intra || 0;
	$: inter = scores?.inter || 0;
	$: positioning = scores?.positioning || 0;
	$: score = scores?.total || 0;


	function activate_man(id: number, page: string) {
		$selManID = id;
		goto(base + '/analysis/manoeuvre/' + page);
	}

	async function runMan() {
		await analyseManoeuvre(id, $optimise, true);
	}
</script>

<div>{$ma?.id}</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button on:click={() => activate_man(id, '')} data-sveltekit-preload-data="tap">{$ma?.name}</button>
<div>{$ma?.k}</div>

{#if scores}
	<button
		style:background-color={colscale(intra, 6, colours)}
		data-sveltekit-preload-data="tap"
		on:click={() => activate_man(id, 'intra')}>{intra.toFixed(2)}</button
	>
	<button
		style:background-color={colscale(inter, 6, colours)}
		data-sveltekit-preload-data="tap"
		on:click={() => activate_man(id, 'inter')}>{inter.toFixed(2)}</button
	>
	<button
		style:background-color={colscale(positioning, 6, colours)}
		data-sveltekit-preload-data="tap"
		on:click={() => activate_man(id, 'positioning')}>{positioning.toFixed(2)}</button
	>
{:else}
	<div>-</div>
	<div>-</div>
	<div>-</div>
{/if}

{#if scores}
	<button
		on:click={() => activate_man(id, '')}
		data-sveltekit-preload-data="tap"
		style:background-color={colscale((10 - score) * $ma.k, 20, colours)}>{score.toFixed(1)}</button
	>
{:else}
	<div>-</div>
{/if}

{#if $isRunning}
	<div>Busy</div>
{:else}
	<button color="light" style="width:200px" on:click={runMan}>Run</button>
{/if}

<div id="status">{$info}</div>

<style>
	div {
		text-align: center;
	}

	#status {
		font-size: x-small;
		font-weight: lighter;
		justify-self: start;
		white-space: nowrap;
	}
</style>

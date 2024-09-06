<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import BinReader from '$lib/splitter/BinReader.svelte';
	import BoxReader from '$lib/splitter/BoxReader.svelte';
	import BoxPlot from '$lib/splitter/BoxPlot.svelte';
	import { FCJson, Origin } from '$lib/api_objects/fcjson';
	import { GPS, States } from '$lib/geometry';
	import { serverFunc } from '$lib/api_calls';

	export let binFile: File | undefined = undefined;
	export let binData: Record<string, any> | undefined = undefined;
	export let binOrigin: Origin | undefined = undefined;
	export let fcj: FCJson | undefined = undefined;
	export let states: States | undefined = undefined;

	async function createState() {
		states = States.parse(
			await serverFunc('create_state', { data: binData, site: binOrigin }, 'POST')
		);
	}

	$: if (binFile || binOrigin) {
		states = undefined;
	}

	const handleNewBin = (e) => {
		if (binData.hasOwnProperty('ORGN[1]')) {
			if (
				!binOrigin ||
				GPS.sub(
					new GPS(binData['ORGN[1]'].Lat[0], binData['ORGN[1]'].Lng[0], binData['ORGN[1]'].Alt[0]),
					new GPS(binOrigin.lat, binOrigin.lng, binOrigin.alt)
				).length() > 300
			) {
				binOrigin = new Origin(
					binData['ORGN[1]'].Lat[0],
					binData['ORGN[1]'].Lng[0],
					binData['ORGN[1]'].Alt[0],
					0,
					0,
					0
				);
			}
		}
	};
</script>

<div class="parent">
	<BinReader bind:data={binData} bind:bin={binFile} on:loaded={handleNewBin} />
	<div style:grid-row="2">
		<BoxReader bind:origin={binOrigin} bind:fcj />
	</div>
	<div style:grid-row="2" style:grid-column="2">
		<Button on:click={createState}>Create State</Button>
	</div>

	<div class="plot">
		{#if binData && binData.POS && binOrigin}
			<BoxPlot bind:binData bind:binOrigin />
		{/if}
	</div>
</div>

<style>
	.parent {
		display: grid;
		height: 100%;
		width: 100%;
		grid-template-columns: 1fr min-content;
		grid-template-rows: min-content min-content 1fr;
	}
	.plot {
		height: 100%;
		grid-column: 1/3;
	}
</style>

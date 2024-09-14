<script lang="ts">
	import BinReader from '$lib/splitter/BinReader.svelte';
	import BoxReader from '$lib/splitter/BoxReader.svelte';
	import FcJsonReader from '$lib/splitter/FCJsonReader.svelte';
	import { GPS, States } from '$lib/geometry';
	import Splitter from '$lib/splitter/Splitter.svelte';
	import { Origin, ScheduleInfo } from '$lib/api_objects/fcjson';
	import BoxPlot from '$lib/splitter/BoxPlot.svelte';
	import { ButtonGroup, RadioButton, Button } from 'flowbite-svelte';
	import { serverFunc } from '$lib/api_calls';
	import { MA } from '$lib/api_objects/mandata';
	import { analyses, createAnalyses, bin, binData, origin, fcj, isCompFlight, clearAnalysis, manoeuvres } from '$lib/stores';
	import { html } from './instructions.md';
	import {goto} from '$app/navigation';
	import {base} from '$app/paths';
	import {ManSplit } from '$lib/splitter/splitting';
	import {get} from 'svelte/store';

	clearAnalysis();

	let states: States;
	let mans: ManSplit[];
	let activeTab = 'Info';

	const handleNewBin = () => {
		if ($binData.hasOwnProperty('ORGN[1]') && !$fcj) {
			if (
				!$origin ||
				GPS.sub(
					new GPS(
						$binData['ORGN[1]'].Lat[0],
						$binData['ORGN[1]'].Lng[0],
						$binData['ORGN[1]'].Alt[0]
					),
					new GPS($origin.lat, $origin.lng, $origin.alt)
				).length() > 300
			) {
				$origin = new Origin(
					$binData['ORGN[1]'].Lat[0],
					$binData['ORGN[1]'].Lng[0],
					$binData['ORGN[1]'].Alt[0],
					0
				);
			}
		}
		activeTab = 'Box';
	};

	const handleNewFCJ = () => {
		$origin = $fcj.origin;
		activeTab = 'Box';
		mans = undefined;
	};

	async function createState() {
		if ($bin && $origin) {
			states = States.parse(
				await serverFunc('create_state', { data: $binData, site: $origin }, 'POST')
			);
			activeTab = 'Manoeuvres';
		} else if ($fcj) {
			states = States.parse(
				await serverFunc('create_state_fcj', { data: $fcj.data, site: $origin }, 'POST')
			);
			activeTab = 'Manoeuvres';
		}
	}

	$: if (states && $fcj) {
		const fcjl = states.getFCJLength();
		if ($fcj.data.length != fcjl) {
			console.log(`removing fcj as length (${$fcj.data.length}) does not match states (${fcjl})`);
			$fcj = undefined;
		}
	}

	function createAnalysis() {
		let direction = $isCompFlight ? states.data[mans[0].stop].direction_str() : 'Infer';
		let analysisMans: number[] = [];
		mans.forEach((man, i)=>{if (man.sinfo) {analysisMans.push(i)}});

		createAnalyses(analysisMans.map(i=>mans[i].name));
		analysisMans.forEach((id, i) => {
			analyses[i].set(
				new MA(
					mans[id].name,
					i+1,
					mans[id].sinfo,
					direction,
					new States(states.data.slice(mans[id-1]?.stop | 0, mans[id].stop)),
					$fcj?.manhistory(id) || {},
					get(manoeuvres)[mans[id].sinfo.to_string()][mans[id].id-1].k
				)
			);
		});

		goto(base + '/analysis');
	}
</script>

<div class="parent">
	<div class="bg1">
		<ButtonGroup>
			{#if !states}
				<BinReader bind:data={$binData} bind:bin={$bin} on:newBin={handleNewBin} />
				<FcJsonReader bind:fcj={$fcj} on:newFCJ={handleNewFCJ} />
				<BoxReader bind:origin={$origin} />
				<Button on:click={createState}>Create State</Button>
			{:else}
				<Button
					on:click={() => {
						states = undefined;
						activeTab = 'Info';
					}}>Clear State</Button
				>
				<Button on:click={createAnalysis}>Setup Analysis</Button>
			{/if}
		</ButtonGroup>
	</div>
	<div class="bg2">
		<ButtonGroup>
			<RadioButton bind:group={activeTab} value={'Info'}>Info</RadioButton>
			<RadioButton bind:group={activeTab} value={'Box'} disabled={!$binData}>Box</RadioButton>
			<RadioButton bind:group={activeTab} value={'Manoeuvres'} disabled={!states}
				>Manoeuvres</RadioButton
			>
		</ButtonGroup>
	</div>
	<div class="display">
		{#if activeTab == 'Info'}
			{@html html}
		{:else if activeTab == 'Box'}
			<BoxPlot bind:binData={$binData} bind:origin={$origin} />
		{:else if activeTab == 'Manoeuvres'}
			<Splitter {states} bind:mans bind:fcj={$fcj} bind:compFlight={$isCompFlight} />
		{/if}
	</div>
</div>

<style>
	.bg2 {
		justify-self: right;
	}
	.display {
		grid-column: 1/3;
		height: 100%;
	}
	.parent {
		height: 100%;
		justify-self: stretch;
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: min-content 1fr;
	}
</style>

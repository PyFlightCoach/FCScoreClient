<script lang="ts">
	import BinReader from './BinReader.svelte';
	import BoxReader from './BoxReader.svelte';
	import FcJsonReader from './FCJsonReader.svelte';
	import { GPS } from '$lib/geometry';
	import { split_states, States } from '$lib/state';
	import Splitter from './Splitter.svelte';
	import { Origin } from '$lib/fcjson';
	import BoxPlot from './BoxPlot.svelte';
	import { ButtonGroup, RadioButton, Button, P, List, Li, Heading, Tooltip } from 'flowbite-svelte';
	import { MA } from '$lib/ma';
	import {
		analyses,
		bin,
		origin,
		fcj,
		isCompFlight,
		manoeuvres,
		binData,
		loadSchedules,
		loadManoeuvres
	} from '$lib/stores';
	import { createAnalyses, clearAnalysis } from '$lib/analysis';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { parseFCJMans, ManSplit } from '$lib/splitting';
	import { get } from 'svelte/store';
	import Info from './Info.svelte';

	clearAnalysis();

	let mans: ManSplit[];
	let activeTab = 'Info';
	let boxKind = 'F3A';
	let busy = false;
	let states: States | undefined;
	let activeMan: number = 0;

	$: if ($binData && !$fcj) {
		if (
			!$origin ||
			GPS.sub(
				new GPS($binData.orgn.Lat[0], $binData.orgn.Lng[0], $binData.orgn.Alt[0]),
				new GPS($origin.lat, $origin.lng, $origin.alt)
			).length() > 300
		) {
			$origin = new Origin($binData.orgn.Lat[0], $binData.orgn.Lng[0], $binData.orgn.Alt[0], 0);
		}
	}

	$: if ($binData) {
		states = States.from_xkf1($origin.noMove(), $binData.orgn, $binData.xkf1);
	}

	$: if ($fcj) {
		if (!$binData) {
			states = States.from_fcj($fcj);
		}
		$fcj.sinfo
			.to_pfc()
			.then((pfcSinfo) => {
				loadSchedules(pfcSinfo.category);
				return loadManoeuvres(pfcSinfo.category, pfcSinfo.name);
			})
			.then((manDetails) => {
				return parseFCJMans($fcj.mans, manDetails, states.getFCJIndexOffset());
			})
			.then((fcjManSplits) => {
				mans = fcjManSplits;
				console.log('Loaded mans from fcj');
			});
	}

	function createAnalysis() {
		let direction = $isCompFlight ? states.data[mans[0].stop].direction_str() : 'Infer';
		let analysisMans: number[] = [];
		mans.forEach((man, i) => {
			if (man.sinfo) {
				analysisMans.push(i);
			}
		});

		createAnalyses(analysisMans.map((i) => mans[i].name));

		const sts = $binData ? undefined : split_states(states.data, 'manoeuvre');
		analysisMans.forEach((id, i) => {
			analyses[i].set(
				new MA(
					mans[id].name,
					i + 1,
					id > 0 ? states.data[mans[id - 1].stop].t : 0,
					states.data[mans[id].stop].t,
					mans[id].sinfo,
					direction,
					$fcj?.manhistory(id) || {},
					get(manoeuvres)[mans[id].sinfo.to_string()][mans[id].id - 1].k,
					sts
						? new States(
								states.data.slice(id > 0 ? mans[id - 1].stop : 0, mans[id].stop)
							)
						: undefined
				)
			);
		});
		goto(base + '/analysis');
	}
</script>

<div class="parent">
	<div class="bg">
		<ButtonGroup>
			<BinReader
				on:loaded={(e) => {
					$binData = e.detail.data;
					$bin = e.detail.file;
				}}
				on:clear={() => {
					activeTab = 'Info';
					$bin = undefined;
					$binData = undefined;
				}}
			/>
			<FcJsonReader
				bind:fcj={$fcj}
				on:newFCJ={() => {
					$origin = $fcj.origin;
				}}
			/>
			<BoxReader bind:origin={$origin} bind:kind={boxKind} />
			<Button on:click={createAnalysis}>Setup Analysis</Button>
		</ButtonGroup>
	</div>
	<div class="bg">
		<ButtonGroup>
			<RadioButton bind:group={activeTab} value={'Info'}>Info</RadioButton>
			<RadioButton bind:group={activeTab} value={'Box'} disabled={!$binData}>Box</RadioButton>
			<RadioButton bind:group={activeTab} value={'Manoeuvres'} disabled={!states}
				>Manoeuvres</RadioButton
			>
		</ButtonGroup>
	</div>
	{#if $fcj && states && $fcj.data.length != states.getFCJLength()}
		<ButtonGroup>
			<P size="sm" color="text-red-700 dark:text-red-500"
				>Warning: FCJ.length={$fcj.data.length}, st.length={states.getFCJLength()}</P
			>
			<Button
				on:click={() => {
					$fcj = undefined;
				}}>dissconnect FCJ</Button
			>
		</ButtonGroup>
		<Tooltip>
			Either the FCJ was created from a different BIN file (probably not good), or the flight coach
			plotter used a different set of sources (probably fine). Double check splitting and consider
			dissconnecting FCJ file from this analysis.
		</Tooltip>
	{/if}
	<div class="display">
		{#if busy}
			<div class="loading">
				<Heading tag="h4">Loading...</Heading>
				<P
					>This can take a minute or two, for better performance try running the analysis server
					locally</P
				>
			</div>
		{:else if activeTab == 'Info'}
			<div class="info">
				<Info />
			</div>
		{:else if activeTab == 'Box'}
			<BoxPlot bind:binData={$binData} bind:origin={$origin} bind:kind={boxKind} />
		{:else if activeTab == 'Manoeuvres'}
			<Splitter
				bind:states
				bind:mans
				bind:fcj={$fcj}
				bind:compFlight={$isCompFlight}
				bind:activeMan
			/>
		{/if}
	</div>
</div>

<style>
	.bg {
		justify-self: center;
	}
	.display {
		grid-column: 1/4;
		height: 100%;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		align-content: stretch;
	}
	.parent {
		height: 100%;
		width: 100%;
		justify-self: center;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		grid-template-rows: min-content 1fr;
	}
	.info {
		width: 70%;
		justify-self: center;
		margin-left: auto;
		margin-right: auto;
	}
	.loading {
		width: 70%;
		justify-self: center;
		margin-left: auto;
		margin-right: auto;
		align-self: center;
	}
</style>

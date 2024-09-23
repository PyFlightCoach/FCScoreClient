<script lang="ts">
	import BinReader from './BinReader.svelte';
	import BoxReader from './BoxReader.svelte';
	import FcJsonReader from './FCJsonReader.svelte';
  import AnalysisReader from '../AnalysisReader.svelte';
	import { GPS, States } from '$lib/geometry';
	import Splitter from './Splitter.svelte';
	import { Origin } from '$lib/api_objects/fcjson';
	import BoxPlot from './BoxPlot.svelte';
	import { ButtonGroup, RadioButton, Button, P, List, Li , Heading} from 'flowbite-svelte';
	import { serverFunc } from '$lib/api_calls';
	import { MA } from '$lib/api_objects/ma';
	import {
		analyses,
		bin,
		origin,
		fcj,
		isCompFlight,
		manoeuvres,
		states, activeHelp
	} from '$lib/stores';
  import { createAnalyses, clearAnalysis} from '$lib/analysis';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { ManSplit } from '$lib/splitting';
	import { get } from 'svelte/store';
  import Info from './Info.svelte';
	
  
	clearAnalysis();

	let mans: ManSplit[];
	let activeTab = 'Info';
	let boxKind = 'F3A';
	let binData: Record<string, any> = {};

  $: $activeHelp = activeTab;

	const handleNewBin = () => {
		if (binData.hasOwnProperty('ORGN[1]') && !$fcj) {
			if (
				!$origin ||
				GPS.sub(
					new GPS(binData['ORGN[1]'].Lat[0], binData['ORGN[1]'].Lng[0], binData['ORGN[1]'].Alt[0]),
					new GPS($origin.lat, $origin.lng, $origin.alt)
				).length() > 300
			) {
				$origin = new Origin(
					binData['ORGN[1]'].Lat[0],
					binData['ORGN[1]'].Lng[0],
					binData['ORGN[1]'].Alt[0],
					0
				);
			}
		}
		activeTab = 'Box';
    
	};


	const handleNewFCJ = () => {
		$origin = $fcj.origin;
		mans = undefined;
	};

	async function createState() {
		if ($bin && $origin) {
			states.set(
				States.parse(await serverFunc('create_state', { data: binData, site: $origin }, 'POST'))
			);
			activeTab = 'Manoeuvres';
		} else if ($fcj) {
			states.set(
				States.parse(
					await serverFunc('create_state_fcj', { data: $fcj.data, site: $origin }, 'POST')
				)
			);
			activeTab = 'Manoeuvres';
		}
	}

	$: if ($states && $fcj) {
		const fcjl = $states.getFCJLength();
		if ($fcj.data.length != fcjl) {
			console.log(`removing fcj as length (${$fcj.data.length}) does not match $states (${fcjl})`);
			//$fcj = undefined;
		}
	}

	function createAnalysis() {
		let direction = $isCompFlight ? $states.data[mans[0].stop].direction_str() : 'Infer';
		let analysisMans: number[] = [];
		mans.forEach((man, i) => {
			if (man.sinfo) {
				analysisMans.push(i);
			}
		});

		createAnalyses(analysisMans.map((i) => mans[i].name));

		analysisMans.forEach((id, i) => {
			analyses[i].set(
				new MA(
					mans[id].name,
					i + 1,
					id > 0 ? mans[id - 1].stop : 0,
					mans[id].stop,
					mans[id].sinfo,
					direction,
					new States($states.data.slice(mans[id - 1]?.stop | 0, mans[id].stop)),
					$fcj?.manhistory(id) || {},
					get(manoeuvres)[mans[id].sinfo.to_string()][mans[id].id - 1].k
				)
			);
		});
		goto(base + '/analysis');
	}
</script>

<div class="parent">
	<div class="bg">
		<ButtonGroup>
			{#if !$states}
				<BinReader
					bind:data={binData}
					bind:bin={$bin}
					on:newBin={handleNewBin}
					on:clear={() => {
						activeTab = 'Info';
					}}
				/>
				<FcJsonReader bind:fcj={$fcj} on:newFCJ={handleNewFCJ} />
				<BoxReader bind:origin={$origin} bind:kind={boxKind} />
				<Button on:click={createState}>Create State</Button>
			{:else}
				<Button
					on:click={() => {
						$states = undefined;
						activeTab = 'Info';
					}}>Clear State</Button
				>
				<Button on:click={createAnalysis}>Setup Analysis</Button>
			{/if}
		</ButtonGroup>
	</div>
  <div class="bg">
		<ButtonGroup>
			<RadioButton bind:group={activeTab} value={'Info'}>Info</RadioButton>
			<RadioButton bind:group={activeTab} value={'Box'} disabled={!binData}>Box</RadioButton>
			<RadioButton bind:group={activeTab} value={'Manoeuvres'} disabled={!$states}
				>Manoeuvres</RadioButton
			>
		</ButtonGroup>
	</div>
	<div class="display">
		{#if activeTab == 'Info'}
      <div class="info">
        <Info/>
        <Heading tag="h4">Loaded Files:</Heading>
        <List>
          <Li>Bin File: {$bin?.name}</Li>
          <Li>FC json: {$fcj?.name}</Li>
          
        </List>
      </div>
      
		{:else if activeTab == 'Box'}
			<BoxPlot bind:binData bind:origin={$origin} bind:kind={boxKind} />
		{:else if activeTab == 'Manoeuvres'}
			<Splitter bind:states={$states} bind:mans bind:fcj={$fcj} bind:compFlight={$isCompFlight} />
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
    margin-left: auto; margin-right: auto;
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
    width: 70%; justify-self: center; margin-left: auto; margin-right: auto;
  }

</style>

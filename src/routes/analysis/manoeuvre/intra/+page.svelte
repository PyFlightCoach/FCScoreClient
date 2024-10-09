<script lang="ts">
	import PlotSec from '$lib/plots/PlotSec.svelte';
	import PlotDTW from '$lib/plots/PlotDTW.svelte';
	import { analyses, selManID } from '$lib/stores';
	import type { States } from '$lib/state';
	import CriteriaPlot from './CriteriaPlot.svelte';
	import VisPlot from './VisPlot.svelte';
	import DGPlot from './DGPlot.svelte';
	import ColouedTable from '$lib/ColouedTable.svelte';
	

	$: man = analyses[$selManID];

	$: summaries = $man?.scores.intra.summaries();

	let states: Record<string, States>;
	let templates: Record<string, States>;
	$: states = $man?.flown.split();
	$: templates = $man?.template!.split();

	let activeCriteria: null | string = null;
	let activeDGName: null | string = null;
	let activeIndex: null | number = 0;

	$: activeED = $man?.mdef.getEd(activeDGName);
	$: dg = activeED?.getDG(activeCriteria);

	$: element = $man?.manoeuvre.getEl(activeED?.name);

	$: showintra = activeDGName != null && activeCriteria != null && activeCriteria != 'Total';
	$: result =
		activeDGName && activeCriteria
			? $man?.scores!.intra.data[activeDGName].data[activeCriteria]
			: undefined;
</script>

<div id="container">
  {#if $man}
	<ColouedTable data={summaries} bind:activeRow={activeDGName} bind:activeCol={activeCriteria} />
  
	<div id="intra_summary">
		<div class="plot" class:fullwidth={!showintra} class:fullheight={!showintra}>
			{#if activeED}
				<PlotSec
					flst={states[activeED.name].move(templates[activeED.name].data[0].pos)}
					tpst={templates[activeED.name]}
					bind:i={activeIndex}
          controls={['play', 'scale', 'speed', 'projection', 'modelClick']}
          fixRange
          scale={3}
				/>
			{:else}
				<PlotDTW sts={states} bind:activeEl={activeDGName} sp={4}/>
			{/if}
		</div>

		{#if element && result && dg}
			<div class="plot split">
				<div class="description">
					<div class="row">Measurement: {dg.measure}</div>
					<div class="row">Element: {element.describe()}</div>
          <div class="row">Sample: {dg.describe_selectors()}</div>
          <div class="row">Smoothing: {dg.smoothers.length>0?dg.smoothers:'None'} </div>
          <div class="row">Criteria: {dg.criteria_description(result)}</div>
				</div>
				
				{#if activeIndex!=null}
	        <VisPlot {result} downgrade={dg} vis={result.measurement.visibility[activeIndex]}/>
        {/if}
        <CriteriaPlot {result} downgrade={dg} />
				
      
        
			</div>
			<div class="plot fullwidth"><DGPlot {result} bind:activeIndex /></div>
		{/if}
	</div>
  {:else}
    <div>No data</div>
  {/if}
</div>

<style>
	#container {
		display: grid;
		grid-template-columns: 1fr 2fr;
	}
	.plot {
		height: 100%;
		width: 100%;
	}
	.plot.fullwidth {
		grid-column: 1 / 3;
	}
	.plot.fullheight {
		grid-row: 1 / 3;
	}

	.plot.split {
		display: grid;
		grid-template-rows: min-content 1fr;
		grid-template-columns: 1fr 1fr;
	}

  .description {
    line-height: 20pt;
		grid-column: 1 /3;
  }

  div.description>div:nth-of-type(odd) {
    background: #e0e0e0;
  }

	#intra_summary {
		display: grid;
		grid-template-columns: 3fr 2fr;
		grid-template-rows: 1fr 1fr;
	}
</style>

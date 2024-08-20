<script lang="ts">
  import PlotSec from '$lib/plots/PlotSec.svelte';
  import PlotDTW from '$lib/plots/PlotDTW.svelte';
  import { internals, activeManoeuvre, fcj} from '$lib/stores';
  import type {States } from '$lib/geometry';
  import CriteriaPlot from './CriteriaPlot.svelte';
  import DGPlot from './DGPlot.svelte';
	import ColouedTable from '$lib/ColouedTable.svelte';
  import { goto } from '$app/navigation';

  $: manid = $fcj?.unique_names.indexOf($activeManoeuvre!);
  $: man = $internals![manid!];
  
  $: if (!man.scores) {goto('/analysis/');}

  $: summaries = man!.scores!.intra.summaries();

  let states: Record<string, States>;
  let templates: Record<string, States>;
  $: states = man!.flown.split();
  $: templates = man!.template!.split();
  
  let activeCriteria: null|string = null;
  let activeDGName: null|string = null;
  let activeIndex: null|number = 0;

  $: activeED = man?.mdef.getEd(activeDGName);
  $: dg = activeED?.getDG(activeCriteria);

  $: element = man!.manoeuvre!.getEl(activeED?.name);

  $: showintra = activeDGName != null && activeCriteria != null  && activeCriteria != 'Total';
  $: result = activeDGName && activeCriteria ? man.scores!.intra.data[activeDGName].data[activeCriteria] : undefined;

</script>


<div id='container'>
  <ColouedTable data={summaries} bind:activeRow={activeDGName} bind:activeCol={activeCriteria}/>  

  <div id='intra_summary'>
    <div class='plot' class:fullwidth={!showintra} class:fullheight={!showintra}> 
      {#if activeED}
        <PlotSec 
          flst={states[activeED.name]}
          tpst={templates[activeED.name]}
          bind:i={activeIndex}
        />
      {:else}
        <PlotDTW
          sts={states}
          bind:activeEl={activeDGName}
        />
      {/if}
    </div>
    
    {#if showintra}  
      <div class='plot split'>
        <div>
            <p>{dg.name.replaceAll('_', ' ')} downgrade for {element.kind} element {activeDGName}</p>
            {#if Object.keys(element).indexOf('length') >=0}<p>length = {element.length.toFixed(0)} m</p>{/if}
            {#if Object.keys(element).indexOf('radius') >=0}<p>radius = {element.radius.toFixed(0)} m</p>{/if}
            {#if Object.keys(element).indexOf('roll') >=0}<p>roll = {(element.roll * 180 / Math.PI).toFixed(0)} degrees</p>{/if}
            {#if Object.keys(element).indexOf('angle') >=0}<p>angle = {(element.angle * 180 / Math.PI).toFixed(0)} degrees</p>{/if}
          
          <p>downgrade = {man.scores?.intra.data[activeDGName].data[activeCriteria].total.toFixed(2)}</p>
        </div>
        {#if dg}
          <CriteriaPlot {result} downgrade={dg}/>
        {/if}
        
      </div>  
      <div class='plot fullwidth'><DGPlot 
        {result}
        bind:activeIndex={activeIndex}
      /></div>

    {/if}
  </div>

</div>


<style>
  #container {display:grid; grid-template-columns:1fr 2fr;  }
  .plot {height: 100%;  width: 100%;}
  .plot.fullwidth {grid-column: 1 / 3;}
  .plot.fullheight {grid-row: 1 / 3;}
  
  .plot.split {display: grid; grid-template-rows: min-content 1fr;}

  #intra_summary {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 1fr 1fr;
  }

</style>
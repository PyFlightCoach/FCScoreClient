<script lang="ts">
  import {flightdata, navitems, NavContent} from '$lib/stores';
  import AnalysisSummary from './AnalysisSummary.svelte';
  import Difficulty from './Difficulty.svelte';
  export let data;
  let mannames = flightdata.mannames;
  let difficulty: (v:number)=>number;

  $navitems=[
    new NavContent('Analyse All', '', ()=>{flightdata.analyseList(Object.keys($mannames))}),
    new NavContent('Intended FC Json', '', () => {flightdata.downloadTemplate('intended')}),
    new NavContent('Corrected FC Json', '', () => {flightdata.downloadTemplate('corrected')}),
  ];

  let total=0;


</script>

<div id='parent'>
  <Difficulty bind:difficulty={difficulty}/>
  <div style='grid-column:2;'><AnalysisSummary 
    analysisName={data.analysis_name} 
    bind:total={total}
    difficulty={difficulty}
  /></div>
  <h2>Total Score = {total.toFixed(1)}</h2>
  
  
</div>

<style>
  #parent {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr ;
    align-items: start;
    height: 100%;
    width: 100%;
  }

  h2 {
    font-size: large;
    font-weight: bold;
    justify-self: end;
    grid-column:2;
  }
</style>
<script lang="ts">
  import {flightdata} from '$lib/stores';
  import ManSummary from './ManSummary.svelte';

  export let analysisName: string;

  let mannames = flightdata.mannames;
  
</script>


<div id='parent'>
  <div style:grid-row='1 / 3'>Manoeuvre</div>
  <div style:grid-row='1 / 3'>K Factor</div>
  <div style:grid-column='3 / 6'>Downgrades</div>
  <div style:grid-column='6' style:grid-row='1 / 3'>Score</div>
  <div>Intra</div>
  <div>Inter</div>
  <div>Position</div>
  {#each Object.keys($mannames) as mn}
    <ManSummary analysisName={analysisName} manname={mn} />
  {/each}



</div>
  



<style>
  div { text-align: center;}

  #parent {
    display: grid;
    grid-template-columns: repeat(6, 1fr) ;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
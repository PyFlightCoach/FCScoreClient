<script lang="ts">
	import {flightdata} from '$lib/stores';
  import ManSummary from './ManSummary.svelte';

  export let total: number = 0;
  export let difficulty: (v: number)=>number;

  let mannames = flightdata.mannames;
  
  let totals: Record<string, number> = {};

  $mannames.forEach((mn) => {
    totals[mn] = 0;
  });

  const getTotal = (ttls: Record<string, number>) => {
    let total = 0;
    $mannames.forEach((mn) => {
      total += ttls[mn];
    });
    return total;
  };

  $: total = getTotal(totals);

</script>

<div id='parent'>
  <div style:grid-row='1 / 3'>#</div>
  <div style:grid-row='1 / 3'>Manoeuvre</div>
  <div style:grid-row='1 / 3'>K Factor</div>
  <div style:grid-column='4 / 7'>Downgrades</div>
  <div style:grid-column='7' style:grid-row='1 / 3'>Score</div>
  <div>Intra</div>
  <div>Inter</div>
  <div>Position</div>
  {#each $mannames as mn}
    <ManSummary 
      manname={mn} 
      bind:total={totals[mn]} 
      difficulty={difficulty}
    />
  {/each}

</div>

<style>
  div { text-align: center;}

  #parent {
    display: grid;
    grid-template-columns: repeat(7, 1fr) ;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
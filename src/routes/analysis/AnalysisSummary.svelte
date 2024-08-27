<script lang="ts">
	import {fcj} from '$lib/stores';
  import ManSummary from './ManSummary.svelte';

  
</script>

<div id='parent'>
  <div style:grid-row='1 / 3'>#</div>
  <div style:grid-row='1 / 3'>Manoeuvre</div>
  <div style:grid-row='1 / 3'>K Factor</div>
  <div style:grid-column='4 / 7'>Downgrades</div>
  <div style:grid-column=7 style:grid-row='1 / 3'>Score</div>
  <div>Intra</div>
  <div>Inter</div>
  <div>Position</div>
  <div style:grid-row='1 / 3' style:grid-column=8></div>
  <div style:grid-row='1 / 3' style:grid-column=9></div>
  {#if $fcj}
    {#each $fcj.unique_names.slice(1,-1) as mn}
      <ManSummary manname={mn}/>
    {/each}
  {/if}
</div>

<style>
  div { text-align: center;}

  #parent {
    display: grid;
    grid-template-columns: repeat(8, 1fr) auto ;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
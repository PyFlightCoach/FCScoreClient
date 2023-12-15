
<script lang="ts">

  import {flightdata} from '$lib/stores';
  import {d3Colors, colscale, redsColors} from '$lib/plots/styling';
  
  export let analysisName: string;
  export let manname: string;


  $: man = flightdata.mans[manname];
  $: aligned = !('fl' in $man); 
  $: busy = $man.busy;
  $: scored = 'score' in $man;

</script>


<div>{manname}</div>
<div>{$man.mdef.info.k}</div>

{#if scored}
  <a style:background-color={colscale($man.score.intra.total, 6, redsColors)} href='{analysisName}/{manname}/intra'>{$man.score.intra.total.toFixed(2)}</a>
  <a style:background-color={colscale($man.score.inter.total, 6, redsColors)} href='{analysisName}/{manname}/inter'>{$man.score.inter.total.toFixed(2)}</a>
  <a style:background-color={colscale($man.score.positioning.total, 6, redsColors)} href='{analysisName}/{manname}/positioning'>{$man.score.positioning.total.toFixed(2)}</a>
{:else}
  <div>-</div>
  <div>-</div>
  <div>-</div>
{/if}


<div>
  {#if busy}
    <div>Busy</div>
  {:else if scored}
    <a href='{analysisName}/{manname}/summary'>{$man.score.score.toFixed(1)}</a>
  {:else if aligned}
    <button color='light' on:click={() => {flightdata.scoreman(manname);}}>Score</button>
  {:else}
    <button color='light' on:click={()=> {flightdata.alignman(manname);}}>Align</button>
  {/if} 
</div>


<style>
  div {text-align: center;}
</style>

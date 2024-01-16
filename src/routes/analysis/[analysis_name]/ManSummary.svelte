
<script lang="ts">

  import {flightdata} from '$lib/stores';
  import {colscale, redsColors} from '$lib/plots/styling';
  import {ScoredMan} from '$lib/api_objects/mandata';

  export let analysisName: string;
  export let manname: string;
  export let difficulty = (v: number) => v;
  export let total = 0;

  $: man = flightdata.mans[manname];
  $: aligned = !('flown' in $man); 
  $: busy = $man.busy;
  
  $: intra = $man instanceof ScoredMan ? $man.score.intra.factoredDG(difficulty) : 0;
  $: inter = $man instanceof ScoredMan ? $man.score.inter.factoredDG(difficulty) : 0;
  $: position = $man instanceof ScoredMan ? $man.score.positioning.factoredDG(difficulty) : 0;


  $: score = $man instanceof ScoredMan ? Math.max((10 - intra - inter - position), 0) : 0;
  $: total = score * $man.mdef.info.k;

</script>


<div>{manname}</div>
<div>{$man.mdef.info.k}</div>

{#if $man instanceof ScoredMan}
  <a style:background-color={colscale(intra, 6, redsColors)} href='{analysisName}/{manname}/intra'>{intra.toFixed(2)}</a>
  <a style:background-color={colscale(inter, 6, redsColors)} href='{analysisName}/{manname}/inter'>{inter.toFixed(2)}</a>
  <a style:background-color={colscale(position, 6, redsColors)} href='{analysisName}/{manname}/positioning'>{position.toFixed(2)}</a>
{:else}
  <div>-</div>
  <div>-</div>
  <div>-</div>
{/if}


<div>
  {#if busy}
    <div>Busy</div>
  {:else if $man instanceof ScoredMan}
    <a href='{analysisName}/{manname}/summary'>{score.toFixed(1)}</a>
  {:else}
    <button color='light' style='width:200px' on:click={()=> {flightdata.analyseManoeuvre(manname);}}>Run Analysis</button>
  {/if} 
</div>


<style>
  div {text-align: center;}
</style>

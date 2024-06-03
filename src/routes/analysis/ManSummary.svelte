
<script lang="ts">

  import {flightdata, truncate} from '$lib/stores';
  import {colscale, redsColors} from '$lib/plots/styling';
  import {AlignedMan, ScoredMan} from '$lib/api_objects/mandata';
  import { base } from '$app/paths'

  export let manname: string;
  export let difficulty = (v: number) => v;
  export let total = 0;

  $: man = flightdata.mans[manname];
  $: busy = $man.busy;
  
  $: intra = $man instanceof ScoredMan ? $man.scores.intra.factoredDG(difficulty, $truncate) : 0;
  $: inter = $man instanceof ScoredMan ? $man.scores.inter.factoredDG(difficulty, $truncate) : 0;
  $: position = $man instanceof ScoredMan ? $man.scores.positioning.factoredDG(difficulty, $truncate) : 0;


  $: score = $man instanceof ScoredMan ? Math.max((10 - intra - inter - position), 0) : 0;
  $: total = score * $man.mdef.info.k;

</script>


<a href='{base}/analysis/manoeuvre?man={manname}'>{manname}</a>
<div>{$man.mdef.info.k}</div>

{#if $man instanceof ScoredMan}
  <a style:background-color={colscale(intra, 6, redsColors)} href='{base}/analysis/manoeuvre/intra?man={manname}'>{intra.toFixed(2)}</a>
  <a style:background-color={colscale(inter, 6, redsColors)} href='{base}/analysis/manoeuvre/inter?man={manname}'>{inter.toFixed(2)}</a>
  <a style:background-color={colscale(position, 6, redsColors)} href='{base}/analysis/manoeuvre/positioning?man={manname}'>{position.toFixed(2)}</a>
{:else}
  <div>-</div>
  <div>-</div>
  <div>-</div>
{/if}


<div>
  {#if busy}
    <div>Busy</div>
  {:else if $man instanceof ScoredMan}
    <a href='{base}/analysis/manoeuvre?man={manname}'>{score.toFixed(1)}</a>
  {:else if $man instanceof AlignedMan}
    <a href='{base}/analysis/manoeuvre?man={manname}'>Alignment</a>
  {:else}
    <button color='light' style='width:200px' on:click={()=> {flightdata.analyseManoeuvre(manname);}}>Run Analysis</button>
  {/if} 
</div>


<style>
  div {text-align: center;}
</style>

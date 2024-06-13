
<script lang="ts">

  import {flightdata} from '$lib/stores';
  import {colscale, redsColors} from '$lib/plots/styling';
  import {Man} from '$lib/api_objects/mandata';
  import { base } from '$app/paths'

  export let manname: string;
  export let difficulty = (v: number) => v;
  export let total = 0;

  $: man = flightdata.mans[manname];
  $: busy = $man.busy;
  
  $: intra = $man.scores===null ? 0 : $man.scores.intra;
  $: inter = $man.scores===null ? 0 :  $man.scores.inter;
  $: position = $man.scores===null ? 0 :  $man.scores.positioning;


  $: score = $man.scores===null ? 0 : $man.scores.total; 
  $: total = $man.scores===null ? 0 : score * $man.scores.k;

</script>

<div>{$man.id+1}</div>
<a href='{base}/analysis/manoeuvre?man={manname}' data-sveltekit-preload-data="tap">{manname}</a>
<div>{$man.scores===null ? '-' : $man.scores.k}</div>

{#if !($man.scores===null)}
  <a style:background-color={colscale(intra, 6, redsColors)} data-sveltekit-preload-data="tap" href='{base}/analysis/manoeuvre/intra?man={manname}'>{intra.toFixed(2)}</a>
  <a style:background-color={colscale(inter, 6, redsColors)} data-sveltekit-preload-data="tap" href='{base}/analysis/manoeuvre/inter?man={manname}'>{inter.toFixed(2)}</a>
  <a style:background-color={colscale(position, 6, redsColors)} data-sveltekit-preload-data="tap" href='{base}/analysis/manoeuvre/positioning?man={manname}'>{position.toFixed(2)}</a>
{:else}
  <div>-</div>
  <div>-</div>
  <div>-</div>
{/if}


<div>
  {#if busy}
    <div>Busy</div>
  {:else if !($man.scores===null)}
    <a href='{base}/analysis/manoeuvre?man={manname}' data-sveltekit-preload-data="tap">{score.toFixed(1)}</a>
  {:else if !($man.elsplits===null)}
    <a href='{base}/analysis/manoeuvre?man={manname}' data-sveltekit-preload-data="tap">Alignment</a>
  {:else}
    <button color='light' style='width:200px' on:click={()=> {flightdata.analyseManoeuvre(manname);}}>Run Analysis</button>
  {/if} 
</div>


<style>
  div {text-align: center;}
</style>

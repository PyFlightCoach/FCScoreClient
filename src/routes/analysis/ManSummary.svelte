
<script lang="ts">

  import {flightdata, mname} from '$lib/stores';
  import {colscale, redsColors} from '$lib/plots/styling';
  import {Man} from '$lib/api_objects/mandata';
  import { base } from '$app/paths';
  import {goto} from '$app/navigation';

  export let manname: string;
  
  
  $: man = flightdata.mans[manname];
  $: busy = $man.busy;
  
  $: intra = $man.scores===null ? 0 : $man.scores.intra;
  $: inter = $man.scores===null ? 0 :  $man.scores.inter;
  $: position = $man.scores===null ? 0 :  $man.scores.positioning;


  $: score = $man.scores===null ? 0 : $man.scores.total; 
  
  function activate_man(name: string, page: string) {
    $mname=name;
    goto(base + '/analysis/manoeuvre/'+page);
  }

</script>

<div>{$man.id+1}</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button on:click={()=>activate_man(manname, '')} data-sveltekit-preload-data="tap">{manname}</button>
<div>{$man.scores===null ? '-' : $man.scores.k}</div>

{#if !($man.scores===null)}
  <button style:background-color={colscale(intra, 6, redsColors)} data-sveltekit-preload-data="tap" on:click={()=>activate_man(manname, 'intra')}>{intra.toFixed(2)}</button>
  <button style:background-color={colscale(inter, 6, redsColors)} data-sveltekit-preload-data="tap" on:click={()=>activate_man(manname, 'inter')}>{inter.toFixed(2)}</button>
  <button style:background-color={colscale(position, 6, redsColors)} data-sveltekit-preload-data="tap" on:click={()=>activate_man(manname, 'positioning')}>{position.toFixed(2)}</button>
{:else}
  <div>-</div>
  <div>-</div>
  <div>-</div>
{/if}


<div>
  {#if busy}
    <div>Busy</div>
  {:else if !($man.scores===null)}
    <button on:click={()=>activate_man(manname, '')} data-sveltekit-preload-data="tap">{score.toFixed(1)}</button>
  {:else if !($man.els===null)}
    <button on:click={()=>activate_man(manname, '')} data-sveltekit-preload-data="tap">Alignment</button>
  {:else}
    <button color='light' style='width:200px' on:click={()=> {flightdata.analyseManoeuvre(manname);}}>Run Analysis</button>
  {/if} 
</div>


<style>
  div {text-align: center;}
</style>

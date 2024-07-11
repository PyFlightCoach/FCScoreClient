
<script lang="ts">

  import {activeManoeuvre, analyseManoeuvre, activeResult, running, difficulty, truncate, fcj} from '$lib/stores';
  import {colscale, redsColors, tealsColrs, yellColors} from '$lib/plots/styling';
  import { base } from '$app/paths';
  import {goto} from '$app/navigation';

  export let manname: string;

  $: manid = $fcj!.unique_names.indexOf(manname);

  $: colours = [yellColors, tealsColrs, redsColors][$difficulty-1];
  
  $: scores = $activeResult?.get_scores($difficulty, $truncate)[manid]?.score;

  $: intra = scores?.intra || 0;
  $: inter = scores?.inter || 0;
  $: positioning = scores?.positioning || 0;
  $: score = scores?.total || 0; 
  $: k = manid ? $fcj!.mans[manid].k : 0;

  function activate_man(name: string, page: string) {
    $activeManoeuvre=name;
    goto(base + '/analysis/manoeuvre/'+page);
  }

</script>

<div>{manid}</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button on:click={()=>activate_man(manname, '')} data-sveltekit-preload-data="tap">{manname}</button>
<div>{k}</div>

{#if scores}
  <button style:background-color={colscale(intra, 6, colours)} data-sveltekit-preload-data="tap" on:click={()=>activate_man(manname, 'intra')}>{intra.toFixed(2)}</button>
  <button style:background-color={colscale(inter, 6, colours)} data-sveltekit-preload-data="tap" on:click={()=>activate_man(manname, 'inter')}>{inter.toFixed(2)}</button>
  <button style:background-color={colscale(positioning, 6, colours)} data-sveltekit-preload-data="tap" on:click={()=>activate_man(manname, 'positioning')}>{positioning.toFixed(2)}</button>
{:else}
  <div>-</div>
  <div>-</div>
  <div>-</div>
{/if}


  {#if $running.includes(manname)}
    <div>Busy</div>
  {:else if scores}
    <button 
      on:click={()=>activate_man(manname, '')} 
      data-sveltekit-preload-data="tap"
      style:background-color={colscale((10 - score) * k, 20, colours)}
    >{score.toFixed(1)}</button>
  {:else}
    <button color='light' style='width:200px' on:click={()=> {analyseManoeuvre(manname);}}>Run Analysis</button>
  {/if} 



<style>
  div {text-align: center;}
</style>

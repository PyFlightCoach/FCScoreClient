<script lang='ts'>
  import { fcj, activeManoeuvre, internals, activeResult } from '$lib/stores';
  import PlotSec from '$lib/plots/PlotSec.svelte';

  $: manid = $fcj?.unique_names.indexOf($activeManoeuvre!);
  $: score = $activeResult?.manresults[manid!]?.get_score(3, false);
</script>  


<div id='container'>
  <div id='table'>

    

    {#if score}
      {#each Object.entries(score.properties) as [key, value]}
        <div>{key}</div><div>{value}</div>
      {/each}
      <div>Total Score</div><div>{score.score.total.toFixed(2)}</div>
    {/if}
  </div>
  {#if $internals && manid} 
    <PlotSec flst={$internals[manid].flown} i={1}/>
  {/if}

</div>

<style>

  #container {display:grid; grid-template-columns:1fr 3fr;  }
  #table {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(auto-fill, 30px);
  }

</style>
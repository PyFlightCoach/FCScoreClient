<script lang='ts'>
  import { selManID, analyses, selectedResult, difficulty, truncate } from '$lib/stores';
  import PlotSec from '$lib/plots/PlotSec.svelte';
  $: man = analyses[$selManID]
  $: result = $man.history[$selectedResult]?.get_score($difficulty, $truncate)?.score;
</script>  

<div id='container'>
  <div id='table'>
    {#if result}
      {#each Object.entries(result) as [key, value]}
        <div>{key}</div><div>{value.toFixed(2)}</div>
      {/each}
    {/if}
  </div>
  {#if $man} 
    <PlotSec flst={$man.flown} i={1}/>
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
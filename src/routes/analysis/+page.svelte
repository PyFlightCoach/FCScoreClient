<script lang="ts">
  import {fcj, activeResult, difficulty, truncate} from '$lib/stores';
  import AnalysisSummary from './AnalysisSummary.svelte';

  $: scores = $activeResult?.get_scores($difficulty, $truncate);

  $: total = scores?.map((v, i)=>v!.score.total * $fcj!.mans[i].k).reduce((a, b) => a + b, 0);
 
</script>

<div id='parent'>
  <div style='grid-column:2;'><AnalysisSummary/></div>
  <h2>Total Score = {total ? total.toFixed(1) : '---'}</h2>  
</div>

<style>
  #parent {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr ;
    align-items: start;
    height: 100%;
    width: 100%;
  }

  h2 {
    font-size: large;
    font-weight: bold;
    justify-self: end;
    grid-column:2;
  }
</style>
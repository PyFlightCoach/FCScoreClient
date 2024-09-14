<script lang="ts">
  
  import AnalysisSummary from './AnalysisSummary.svelte';
  import {totalScore, manNames} from '$lib/stores';
	  
</script>

<div id='parent'>
  <div style='grid-column:2;'><AnalysisSummary/></div>
  <h2>Total Score = {$totalScore }</h2>  
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
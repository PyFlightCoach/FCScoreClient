<script lang="ts">
  import {flightdata, navitems, NavContent} from '$lib/stores';
  import AnalysisSummary from './AnalysisSummary.svelte';
  export let data;
  let mannames = flightdata.mannames;
  
  $navitems=[
    new NavContent('Align All', '', ()=>{flightdata.alignlist(Object.keys($mannames))}),
    new NavContent('Score All', '', ()=>{flightdata.scorelist(Object.keys($mannames))}),
    new NavContent('Intended FC Json', '', () => {flightdata.downloadTemplate('intended')}),
    new NavContent('Corrected FC Json', '', () => {flightdata.downloadTemplate('corrected')}),
  ];

</script>

<div id='parent'>
  <div/>
  <div><AnalysisSummary analysisName={data.analysis_name}/></div>
</div>
<style>
  #parent {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr ;
    align-items: start;

    height: 100%;
    width: 100%;
  }
</style>
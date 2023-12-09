
<script lang="ts">
  import {flightdata} from '$lib/stores';
  import SideBar from '$lib/SideBar.svelte';
  import ManSummary from './ManSummary.svelte';
  export let data;
  let mannames = flightdata.mannames;

  
</script>


<SideBar>
  <div id="table">
      <div>Manoeuvre</div>
      <div>K</div>
      <div>Status</div>
      <div>Score</div>
      {#each Object.keys($mannames) as manname}
        <ManSummary manname={manname} analysis_name={data.analysis_name}/>
      {/each}
  </div>
</SideBar>
  
<slot id="contents"/>

  
<style >

  #table {
    display: grid; 
    width:100%; 
    height:100%;
    grid-template-columns: auto auto auto auto;

  }
  #contents {
      height: 100%;
      width: 100%;
  }
  div {
    text-align: center;
    font-size: medium;
    font-weight: 400;
  }

</style>
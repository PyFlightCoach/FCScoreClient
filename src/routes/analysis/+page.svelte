<script lang="ts">
  import { Heading} from 'flowbite-svelte';
  import {flightdata} from '$lib/stores';
  let mannames = flightdata.mannames;

  

</script>
<div id='parent'>
  <div id='head'>
    <Heading>Analysis</Heading>
    <div>move mouse to left or press spacebar to view manoeuvres</div>
  </div>

</div>


<style>
  div {
    text-align: center;
  }
  #parent {
    display:flex; flex-direction:column; align-items: stretch; 
    height: 100%;
  }
  #head {flex: 0 1 auto;}
</style>

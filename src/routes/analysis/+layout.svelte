
<script lang="ts">
  import { goto } from '$app/navigation';
  import {flightdata} from '$lib/stores';
  import {Button, Dropdown, Chevron, DropdownItem} from 'flowbite-svelte';
  import Mandd from './Mandd.svelte';

  let mannames = flightdata.mannames;


</script>


<div id="parent">
  <div id="manoeuvre-select">
    {#each $mannames as manname}
      <Mandd manname={manname}/>
    {/each}
  
  </div>
  
  <slot id="contents"/>

</div>
  
<style >
  
  #parent {display: flex; flex-direction: row; align-items: stretch; width:100%; height: 100%;}
  #manoeuvre-select {width: 100px; display: flex; flex-direction: column;}
  #contents {
      flex: 1 1 auto;
      
      height: 100%;
      width: 100%;
  }

</style>
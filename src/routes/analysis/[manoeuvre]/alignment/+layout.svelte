

<script lang="ts">
  import {Tooltip, Input, Dropdown, DropdownItem, BottomNav, BottomNavItem} from 'flowbite-svelte';
  let step: number = 1.0;

  import { flightdata } from '$lib/stores.js';
  import {page} from '$app/stores';
  let dropdownOpen = false;
  
  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);

  $: elements = [...new Set($man.al.map((val: Record<string, string>)=>val.element))];
  let element = "select element";

</script>


<div id="parent">
  <slot id="contents"/>  
  <BottomNav classInner="grid-cols-5" id="adjust-split">
    
    <BottomNavItem>{element}</BottomNavItem>
    <Dropdown bind:open={dropdownOpen}>
      {#each elements as el}
        <DropdownItem on:click={()=>{element=el; dropdownOpen=false;}}>{el}</DropdownItem>  
      {/each}
    </Dropdown>
    <BottomNavItem><Input placeholder='step' value={step}/></BottomNavItem>

    <BottomNavItem>&#60</BottomNavItem>
    <BottomNavItem>&#62</BottomNavItem>
    <BottomNavItem>Confirm</BottomNavItem>
    
  </BottomNav>
  <Tooltip triggeredBy="[id='adjust-split']">Select Element, enter step size and use buttons to edit split locations</Tooltip>

</div>

<style>
  #parent {display: flex; flex-direction: row; align-items: stretch; width: 100%; height: 100%; }

  #contents {flex: 1 1 auto;}
</style>

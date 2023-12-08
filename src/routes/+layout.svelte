<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem, Chevron,
    DropdownDivider, Helper, NavHamburger} from 'flowbite-svelte'
  import { mouse } from '$lib/stores';
  import {flightdata, colddraft} from '$lib/stores';
  import { OBJ } from '$lib/plots/traces.js';
  export let data;
  
  let mannanes = flightdata.mannames;
  let name = flightdata.name;
  const clearflight = (target: string = '/') => {
    flightdata.clear();
    window.location.href = target;
  }

  function handleMousemove(event) {
    $mouse = {x: event.clientX, y: event.clientY}
  }
  
  $: if ($colddraft==null) {
    $colddraft = OBJ.parse_dict(data.colddraft);
  }
  
 
</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="parent" on:mousemove={handleMousemove} >

  <Navbar let:hidden let:toggle>
    <NavBrand href='/'>
      FCScore
    </NavBrand>
	<NavHamburger on:click={toggle} />
    <NavUl {hidden}>
      <NavLi id="flightmenu" class="cursor-pointer"><Chevron aligned>Flight</Chevron></NavLi>
      <Dropdown triggeredBy="#flightmenu" class="w-44 z-20">
        <DropdownItem on:click={()=>{clearflight('/upload')}}>load</DropdownItem>
        {#if Object.values(flightdata.mans).length > 0}
          <DropdownDivider/>
          <Helper>{$name}</Helper>
          <DropdownItem href='/analysis'>analysis</DropdownItem>
          <DropdownItem on:click={()=>{clearflight('/')}}>clear</DropdownItem>
        {/if}
      </Dropdown> 
      <!-- 
        <NavLi id="schedulemenu" class="cursor-pointer"><Chevron aligned>Schedule</Chevron></NavLi>
        <Dropdown triggeredBy="#schedulemenu" class="w-44 z-20">
          <DropdownItem href='/schedule/browse'>browse</DropdownItem>
          <DropdownItem href='/schedule/create'>create</DropdownItem>
          <DropdownItem href='/schedule/create/manoeuvre'>create manoeuvre</DropdownItem>
        </Dropdown>
      -->
      <NavLi id='info' class="curser-pointer"><Chevron aligned>Info</Chevron></NavLi>
      <Dropdown triggeredBy="#info" class="w-44 z-20">
        <DropdownItem href='/info'>global</DropdownItem>
        <DropdownItem href='/info/current'>current page</DropdownItem>
      </Dropdown>
    </NavUl>

  </Navbar>
  <div id='page'>
    <slot />
  </div>
</div>

<style>
  #parent {display:flex; flex-flow:column; height:100vh;}
  #page {flex:1 1 auto}

</style>
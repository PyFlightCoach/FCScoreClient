<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem,
    DropdownDivider, Helper, NavHamburger, Checkbox} from 'flowbite-svelte'
  import { mouse } from '$lib/stores';
  import {flightdata, navitems, truncate} from '$lib/stores';
  export let data;
  import { base } from '$app/paths'

  let mannanes = flightdata.mannames;
  let name = flightdata.name;
  const clearflight = (target = '/') => {
    flightdata.clear();
    window.location.href = target;
  }

  function handleMousemove(event) {
    $mouse = {x: event.clientX, y: event.clientY}
  }
  
  
  $truncate = localStorage.getItem('truncate') == 'true';
  $: localStorage.setItem('truncate', $truncate.toString());

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="parent" on:mousemove={handleMousemove} >
  <div>
    <Navbar let:hidden let:toggle>
      <NavBrand href={base}>
        FCScore
      </NavBrand>
    <NavHamburger on:click={toggle} />
      <NavUl {hidden}>
        {#each $navitems as ni}
          <NavLi class="cursor-pointer" href={ni.href} on:click={ni.onclick}>{ni.name}</NavLi>
        {/each}
      </NavUl>
      <NavUl {hidden}>
        <NavLi id="optionsmenu" class="cursor-pointer">Options</NavLi>
        <Dropdown triggeredBy="#optionsmenu" class="w-44 z-20">
          <DropdownItem href='{base}/server'>Analysis Server</DropdownItem>
          <DropdownItem><Checkbox bind:checked={$truncate}>Truncate Downgrades</Checkbox></DropdownItem>
        </Dropdown>
        {#if Object.keys($mannanes).length > 0}
          <NavLi id="manoeuvremenu" class="cursor-pointer">Manoeuvres</NavLi>
          <Dropdown triggeredBy="#manoeuvremenu" class="w-44 z-20">
            {#each Object.keys($mannanes) as mname}
              <DropdownItem href='{base}/analysis/manoeuvre?man={mname}'>{mname}</DropdownItem>
            {/each}    
          </Dropdown>
        {/if} 

        <NavLi id="flightmenu" class="cursor-pointer">Flight</NavLi>
        <Dropdown triggeredBy="#flightmenu" class="w-44 z-20">
          <DropdownItem on:click={()=>{clearflight(base + '/upload')}}>load</DropdownItem>
          {#if Object.values(flightdata.mans).length > 0}
            <DropdownDivider/>
            <Helper>{$name}</Helper>
            <DropdownItem on:click={()=>{flightdata.export()}}>export</DropdownItem>
            <DropdownItem on:click={()=>{clearflight(base)}}>clear</DropdownItem>
          {:else}
            <DropdownItem href={base + '/analysis'} data-sveltekit-preload-data="tap">example</DropdownItem>
          {/if} 
        </Dropdown> 
        <NavLi id='info' class="cursor-pointer" href="https://pfcdocumentation.readthedocs.io/fcscore/index.html" target="_blank">Info</NavLi>
      </NavUl>

    </Navbar>
  </div>
  <slot />

</div>

<style>
  #parent {display:grid; height:100vh; width: 100%; grid-template-rows: min-content 1fr;}
</style>
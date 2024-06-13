<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem,
    DropdownDivider, Helper, NavHamburger, Checkbox} from 'flowbite-svelte'
  import { mouse } from '$lib/stores';
  import {flightdata, navitems, optimise} from '$lib/stores';
  export let data;
  import { base } from '$app/paths'

  let name = flightdata.name;
  let mannames = flightdata.mannames;
  const clearflight = (target = '/') => {
    flightdata.clear();
    window.location.href = target;
  }

  function handleMousemove(event) {
    $mouse = {x: event.clientX, y: event.clientY}
  }
  
  
  $optimise = localStorage.getItem('optimise') == 'true';
  $: localStorage.setItem('optimise', $optimise.toString());

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
          <DropdownItem><Checkbox bind:checked={$optimise}>Optimise Alignment</Checkbox></DropdownItem>
        </Dropdown>
        {#if $mannames.length > 0}
          <NavLi id="manoeuvremenu" class="cursor-pointer">Manoeuvres</NavLi>
          <Dropdown triggeredBy="#manoeuvremenu" class="w-44 z-20">
            {#each $mannames as mname}
              <DropdownItem href='{base}/analysis/manoeuvre?man={$name}'>{mname}</DropdownItem>
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
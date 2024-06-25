<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem,
    DropdownDivider, Helper, NavHamburger, Checkbox, NumberInput} from 'flowbite-svelte'
  import {flightdata, navitems, optimise, mname, mouse, server, difficulty, truncate} from '$lib/stores';
  import { base } from '$app/paths'
  import {goto} from '$app/navigation';
  import { page } from '$app/stores';  
	import { onMount } from 'svelte';
	import Difficulty from './analysis/Difficulty.svelte';
  
  let mannames = flightdata.mannames;
  let fcj = flightdata.fcj;
  const clearflight = (target = '/') => {
    flightdata.clear();
    window.location.href = target;
  }

  function handleMousemove(event) {
    $mouse = {x: event.clientX, y: event.clientY}
  }
  $: {
    $difficulty = Math.round($difficulty);
    if ($difficulty > 3) {$difficulty = 3};
    if ($difficulty < 1) {$difficulty = 1};

  }
  onMount(()=>{
    $server = localStorage.getItem('server') || 'http://localhost:5000';
    $optimise = localStorage.getItem('optimise') === 'true';
    $difficulty = localStorage.getItem('difficulty') ? parseInt(localStorage.getItem('difficulty')!) : 3;
    $truncate = localStorage.getItem('truncate') ? localStorage.getItem('truncate') === 'true' : false;
  })


</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="parent" on:mousemove={handleMousemove} >
  <div>
    <!-- svelte-ignore missing-declaration -->
    <Navbar let:hidden let:toggle>
      <NavBrand href={base + '/'}>
        FCScore
      </NavBrand>
      
      <NavHamburger on:click={toggle} />

      <NavUl {hidden}>
        {#if Object.keys($mannames).length > 0}
          {#if $page.url.pathname.includes('manoeuvre')}

            {#each $navitems as ni}
              <NavLi class="cursor-pointer" href={ni.href} on:click={ni.onclick}>{ni.name}</NavLi>
            {/each}

          {/if}
        {/if}
      </NavUl>

      <NavUl {hidden}>
        <NavLi id="optionsmenu" class="cursor-pointer">Options</NavLi>
        <Dropdown triggeredBy="#optionsmenu" class="w-44 z-20">
          <DropdownItem href='{base}/server'>Analysis Server</DropdownItem>
          <DropdownItem>Difficulty<NumberInput bind:value={$difficulty} min=1 max=3 /></DropdownItem>
          <DropdownItem>Truncate<Checkbox bind:checked={$truncate}/></DropdownItem>
        </Dropdown>
        {#if $mannames.length > 0}
          <NavLi id="manoeuvremenu" class="cursor-pointer">Manoeuvres</NavLi>
          <Dropdown triggeredBy="#manoeuvremenu" class="w-44 z-20">
            {#each Object.keys($mannames) as name}
              <DropdownItem on:click={
                ()=>{$mname=name; goto(base + '/analysis/manoeuvre');}
              }>{name}</DropdownItem>
            {/each}    
          </Dropdown>
        {/if} 

        <NavLi id="flightmenu" class="cursor-pointer">Flight</NavLi>
        <Dropdown triggeredBy="#flightmenu" class="w-44 z-20">
          <DropdownItem on:click={()=>{clearflight(base + '/upload')}}>load</DropdownItem>
          {#if Object.values(flightdata.mans).length > 0}
            <DropdownDivider/>
            <Helper>{$fcj?.short_name}</Helper>
            <DropdownItem href={base + '/analysis'}>Analysis</DropdownItem>
            <DropdownItem><Checkbox bind:checked={$optimise}>Optimise Alignment</Checkbox></DropdownItem>
            
            <DropdownItem on:click={
              ()=>{flightdata.analyseList(Object.keys($mannames), false, $optimise)}
            }>Run Remaining</DropdownItem>
            
            <DropdownItem on:click={
              ()=>{flightdata.analyseList(Object.keys($mannames), true, $optimise)}
            }>Run All</DropdownItem>

            <DropdownItem on:click={() => flightdata.export()} >export</DropdownItem>
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
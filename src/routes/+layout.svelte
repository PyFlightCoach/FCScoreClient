<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem, Chevron,
    DropdownDivider, Helper, NavHamburger, Button, ButtonGroup} from 'flowbite-svelte'
  import { mouse } from '$lib/stores';
  import {flightdata, colddraft, navitems, NavContent} from '$lib/stores';
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
  <div>
    <Navbar let:hidden let:toggle>
      <NavBrand href='/'>
        FCScore
      </NavBrand>
    <NavHamburger on:click={toggle} />
      <NavUl {hidden}>
        
        {#each $navitems as ni}
          <NavLi class="cursor-pointer" href={ni.href} on:click={ni.onclick}>{ni.name}</NavLi>
        {/each}
        
        
      </NavUl>
      <NavUl {hidden}>
        {#if Object.keys($mannanes).length > 0}
          <NavLi id="manoeuvremenu" class="cursor-pointer"><Chevron aligned>Manoeuvres</Chevron></NavLi>
          <Dropdown triggeredBy="#manoeuvremenu" class="w-44 z-20">
            {#each Object.keys($mannanes) as mname}
              <DropdownItem href={'/analysis/' + $name + '/' + mname + '/summary'}>{mname}</DropdownItem>
            {/each}    
          </Dropdown>
        {/if} 

        <NavLi id="flightmenu" class="cursor-pointer"><Chevron aligned>Flight</Chevron></NavLi>
        <Dropdown triggeredBy="#flightmenu" class="w-44 z-20">
          <DropdownItem on:click={()=>{clearflight('/upload')}}>load</DropdownItem>
          {#if Object.values(flightdata.mans).length > 0}
            <DropdownDivider/>
            <Helper>{$name}</Helper>
            <DropdownItem href={'/analysis/' + $name}>analysis</DropdownItem>
            <DropdownItem on:click={()=>{flightdata.export()}}>export</DropdownItem>
            <DropdownItem on:click={()=>{clearflight('/')}}>clear</DropdownItem>
          {:else}
            <DropdownItem href='/analysis/example' data-sveltekit-preload-data="tap">example</DropdownItem>
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
        <NavLi id='info' class="cursor-pointer" href="https://pfcdocumentation.readthedocs.io/fcscore/index.html" target="_blank">Info</NavLi>
      </NavUl>

    </Navbar>
  </div>
  <slot />

</div>

<style>
  #parent {display:grid; height:100vh; width: 100%; grid-template-rows: min-content 1fr;}
</style>
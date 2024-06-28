<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem,
    DropdownDivider, Helper, NavHamburger, Checkbox, Radio,
  } from 'flowbite-svelte'
  import {fcj, clearFlight, navitems, optimise, activeManoeuvre, activeResult,
    analyseList, mouse, server, long_output, exportFCJ, getVersion, difficulty, truncate} from '$lib/stores';
  import { base } from '$app/paths'
  import {goto} from '$app/navigation';
  import { page } from '$app/stores';  
	import { onMount } from 'svelte';
  	
  let selectedResult: string;
	$: selectedResult = $activeResult?.fa_version || 'no result selected';
  $: $difficulty = Math.round($difficulty)
  onMount(()=>{
    getVersion();
    $server = localStorage.getItem('server') || 'http://localhost:5000';
    $optimise = localStorage.getItem('optimise') === 'true';
    $long_output = localStorage.getItem('long_output') ? localStorage.getItem('long_output') === 'true' : false;
  })

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="parent" on:mousemove={(event)=>{$mouse = {x: event.clientX, y: event.clientY}}} >
  <div>
    <!-- svelte-ignore missing-declaration -->
    <Navbar let:hidden let:toggle>
      <NavBrand href={base + '/'}>
        FCScore
      </NavBrand>
      
      <NavHamburger on:click={toggle} />

      <NavUl {hidden}>
        {#if $fcj}
          {#if $page.url.pathname.includes('manoeuvre')}

            {#each $navitems as ni}
              <NavLi class="cursor-pointer" href={ni.href} on:click={ni.onclick}>{ni.name}</NavLi>
            {/each}

          {/if}
        {/if}
      </NavUl>

      <NavUl {hidden}>
        <NavLi class="cursor-pointer">Options</NavLi>
        <Dropdown class="w-30 z-20">
          <DropdownItem href='{base}/server'>Analysis Server</DropdownItem>
          <DropdownItem><Checkbox bind:checked={$long_output}>Long Output</Checkbox></DropdownItem>
          <DropdownItem><Checkbox bind:checked={$optimise}>Optimise Alignment</Checkbox></DropdownItem>
          <DropdownDivider/>
          {#each [1,2,3] as diff }
            <DropdownItem><Radio bind:group={$difficulty} value={diff}>{['Easy', 'Medium', 'Hard'][diff - 1]}</Radio></DropdownItem>
          {/each}
          <DropdownDivider/>
          <DropdownItem><Checkbox bind:checked={$truncate}>Truncate</Checkbox></DropdownItem>
        </Dropdown>
        {#if $fcj}
          <NavLi class="cursor-pointer">Manoeuvres</NavLi>
          <Dropdown class="w-44 z-20">
            {#each $fcj.unique_names.slice(1,-1) as name}
              <DropdownItem on:click={
                ()=>{$activeManoeuvre=name; goto(base + '/analysis/manoeuvre');}
              }>{name}</DropdownItem>
            {/each}    
          </Dropdown>
        {/if} 

        <NavLi class="cursor-pointer">Flight</NavLi>
        <Dropdown class="w-44 z-20">
          <DropdownItem on:click={()=>{clearFlight(base + '/upload')}}>{$fcj ? 'clear' : 'load'}</DropdownItem>
          {#if $fcj}
            <DropdownDivider/>
            <Helper>{$fcj.short_name}</Helper>
            <DropdownItem href={base + '/analysis'}>Analysis</DropdownItem>
            <DropdownItem on:click={
              ()=>{analyseList($fcj.unique_names.slice(1,-1), false, $optimise)}
            }>Run Remaining</DropdownItem>
            
            <DropdownItem on:click={
              ()=>{analyseList($fcj.unique_names.slice(1,-1), true, $optimise)}
            }>Run All</DropdownItem>

            <DropdownItem on:click={exportFCJ} >export</DropdownItem>

            <DropdownDivider/>
            <Helper>Available Analyses</Helper>
            {#each $fcj.fcs_scores as res}
              <DropdownItem><Radio bind:group={selectedResult} value={res.fa_version} on:click={()=>{$activeResult=res}}>{res.fa_version}</Radio></DropdownItem>
            {/each}

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
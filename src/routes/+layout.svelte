<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem,
    DropdownDivider, Helper, NavHamburger, Checkbox, Radio, Input
  } from 'flowbite-svelte'
  import {fcj, clearFlight, navitems, optimise, activeManoeuvre, 
    loadExample, custom_server, analyseList, mouse, 
    server, long_output, exportFCJ, difficulty, truncate,
    selectedResult
  } from '$lib/stores';
  import { base } from '$app/paths'
  import {goto} from '$app/navigation';
  import { page } from '$app/stores';  
  	
  $: $difficulty = Math.round($difficulty)
  let active_server = {
      'http://localhost:5000': 'local',
      'https://madeupmodels.com:5010': 'UK'
    }[$server] || 'custom';
  

  $: $server = {
    local: 'http://localhost:5000',
    UK: 'https://madeupmodels.com:5010',
    custom: $custom_server
  }[active_server]!;

  
</script>

<svelte:head>
    <title>{$fcj ? `${$fcj.sinfo.name} ${$fcj.short_name.slice(-4)}` : 'FCScore' }</title>
</svelte:head>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="parent" on:mousemove={(event)=>{$mouse = {x: event.clientX, y: event.clientY}}} >
  <div>
    <!-- svelte-ignore missing-declaration -->
    <Navbar let:hidden let:toggle>
      <NavBrand href={base + '/'}>FCScore</NavBrand>
      
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
        {#if !$fcj}
          <NavLi class="cursor-pointer" href={base + '/splitter'}>splitter</NavLi>
        {/if}


        <NavLi class="cursor-pointer">Options</NavLi>
        <Dropdown class="w-80 z-20">
          <Helper class="ps-6">Analysis Server</Helper>
          <DropdownItem><Radio bind:group={active_server} value='local'>Local</Radio></DropdownItem>
          <DropdownItem><Radio bind:group={active_server} value='UK'>UK</Radio></DropdownItem>
          <DropdownItem><Radio bind:group={active_server} value='custom'>
            <Input type="url" disabled={active_server!='custom'} bind:value={$custom_server}/>
          </Radio></DropdownItem>
          <DropdownDivider/>
          <Helper class="ps-6">Analysis Options</Helper>
          <DropdownItem><Checkbox bind:checked={$long_output}>Long Output</Checkbox></DropdownItem>
          <DropdownItem><Checkbox bind:checked={$optimise}>Optimise Alignment</Checkbox></DropdownItem>
          <DropdownDivider/>
          <Helper class="ps-6">Results to Display</Helper>
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
              <DropdownItem><Radio bind:group={$selectedResult} value={res.fa_version}>{res.fa_version}</Radio></DropdownItem>
            {/each}

          {:else}
            <DropdownItem on:click={()=>{loadExample(); goto(base + '/upload')}} data-sveltekit-preload-data="tap">example</DropdownItem>
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
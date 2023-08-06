

<script lang="ts">
  import {Button, ButtonGroup, Input, Label, Dropdown, DropdownItem, Chevron, Spinner} from 'flowbite-svelte';
  let step: number = 1.0;

  import { flightdata } from '$lib/stores.js';
  import {page} from '$app/stores';
  let dropdownOpen = false;
  
  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);

  $: elements = [...new Set($man.al.map((val: Record<string, string>)=>val.element))];
  let element = "Select Element";

</script>


<div id="parent">
  <div id="edit_alignment">
  
    <Button  color="alternative">Confirm</Button>
    <Button  color="alternative"><Chevron>{element}</Chevron></Button>
    <Dropdown bind:open={dropdownOpen}>
      {#each elements as el}
        <DropdownItem on:click={()=>{element=el; dropdownOpen=false;}}>{el}</DropdownItem>  
      {/each}
    </Dropdown>
    <Label type=number >Step Size<Input placeholder='step' value={step}/></Label>

    <Button  color="alternative">&#60</Button>
    <Button color="alternative">&#62</Button>
    
  
  </div>
  <slot id="contents"/>  

</div>

<style>
  #parent {display: flex; flex-direction: row; align-items: stretch; width: 100%; }
  #edit_alignment { display: flex; flex-direction: column; width:100px;}
  #contents {flex: 1 1 auto;}
</style>

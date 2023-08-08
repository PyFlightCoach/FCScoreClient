
<script lang="ts">
  export let manname: string;

  import { goto } from '$app/navigation';
  import {flightdata} from '$lib/stores';
  import {Button, Dropdown, Chevron, DropdownItem} from 'flowbite-svelte';
  import {align} from '$lib/api_calls';

  $: man = flightdata.man(manname);
  
  $: aligned = !('fl' in $man); 
  $: busy = $man.busy;
  $: scored = 'score' in $man;

  let dropdownOpen = false;

</script>


<div>
    <Button  color="alternative" ><Chevron>{manname}</Chevron></Button>
    <Dropdown bind:open={dropdownOpen}>
      {#if aligned}
        <DropdownItem  on:click={() => {dropdownOpen=false; goto('/analysis/' + manname + '/alignment');}}>edit alignment</DropdownItem>
        {#if !scored}
          <DropdownItem  on:click={() => {dropdownOpen=false; flightdata.scoreman(manname);}}>calculate scores</DropdownItem>
        {:else}
          <DropdownItem  on:click={() => {dropdownOpen=false; goto('/analysis/' + manname + '/scores');}}>score</DropdownItem>
        {/if}
      {:else}
        <DropdownItem  on:click={()=> {dropdownOpen=false; flightdata.alignman(manname);}}>setup</DropdownItem>
      {/if}  
    </Dropdown>       
</div>
<div>3</div>
<div>
  {#if busy}
    preparing...
  {:else}
    {#if aligned}score{:else}align{/if}
  {/if}
</div>
<div>
  {#if aligned}2.0{:else}-{/if}
</div>

<style>
  div {
    text-align: center;
  }
</style>

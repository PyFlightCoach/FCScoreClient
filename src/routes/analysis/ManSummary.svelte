
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
          <DropdownItem  on:click={() => {dropdownOpen=false; goto('/analysis/' + manname + '/scores');}}>score info</DropdownItem>
        {/if}
      {:else}
        <DropdownItem  on:click={()=> {dropdownOpen=false; flightdata.alignman(manname);}}>Align</DropdownItem>
        <DropdownItem  on:click={()=> {dropdownOpen=false; flightdata.alignman(manname).then(()=>{flightdata.scoreman(manname)});}}>Score</DropdownItem>
      {/if}  
    </Dropdown>

</div>
<div>{$man.mdef.info.k}</div>
<div>
  {#if busy}
    preparing...
  {:else}
    {#if aligned}aligned ({$man.dist.toFixed(0)}){:else}read{/if}
  {/if}
</div>
<div>
  {#if scored}{$man.score.score.toFixed(1)}{:else}-{/if}
</div>

<style>
  div {
    text-align: center;
  }
</style>

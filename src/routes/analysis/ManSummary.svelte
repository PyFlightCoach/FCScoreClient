
<script lang="ts">
  export let manname: string;

  import { goto } from '$app/navigation';
  import {flightdata} from '$lib/stores';
  import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Dropdown, Chevron, DropdownItem} from 'flowbite-svelte';
  import {align} from '$lib/api_calls';
	import { onMount } from 'svelte';

  $: man = flightdata.man(manname);
  
  $: aligned = !('fl' in $man); 
  $: busy = $man.busy;

  let dropdownOpen = false;

  const prepare_alignment = () => {
    if (!aligned && !busy) {
      $man.busy = true;
      align($man.mdef, $man.fl)
      .then((res: Record<string, any>) => {
        man.update((data) => {
          data.al = res;
          delete data.fl;
          data.busy = false;
          return data;
        });
      });
    }; 
  }

</script>


<div>
    <Button  color="alternative" ><Chevron>{manname}</Chevron></Button>
    <Dropdown bind:open={dropdownOpen}>
      {#if aligned}
        <DropdownItem  on:click={() => {dropdownOpen=false; goto('/analysis/' + manname + '/alignment');}}>edit alignment</DropdownItem>
        <DropdownItem  on:click={() => { dropdownOpen=false; goto('/analysis/' + manname + '/scores');}}>score info</DropdownItem>
      {:else}

        <DropdownItem  on:click={prepare_alignment}>setup</DropdownItem>
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
  {#if aligned}
    2.0
  {:else}-{/if}
  
</div>

<style>
  div {
    text-align: center;
  }
</style>

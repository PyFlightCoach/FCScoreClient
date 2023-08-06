
<script lang="ts">
  export let manname: string;

  import { goto } from '$app/navigation';
  import {flightdata} from '$lib/stores';
  import {Button, Dropdown, Chevron, DropdownItem} from 'flowbite-svelte';
  import {align} from '$lib/api_calls';

  $: man = flightdata.man(manname);
  
  $: aligned = !('fl' in $man); 
  $: busy = $man.busy;

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


<Button><Chevron>{manname}</Chevron></Button>
<Dropdown>
  {#if busy} 
    <DropdownItem>preparing...</DropdownItem>
  {:else}
    {#if !aligned}
      <DropdownItem  on:click={prepare_alignment}>prepare analysis</DropdownItem>
    {:else}
      <DropdownItem  on:click={() => {goto('/analysis/' + manname + '/alignment')}}>edit alignment</DropdownItem>
      <DropdownItem  on:click={() => {goto('/analysis/' + manname + '/scores')}}>scoring</DropdownItem>
    {/if}  
  {/if}
</Dropdown>


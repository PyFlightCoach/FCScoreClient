


<script lang="ts">
  import {server} from '$lib/stores';
  import { Label, Input, Button} from 'flowbite-svelte';

  let new_server = $server;

</script>

<div class="mb-6">
  <Label for="server_input" class="block mb-2">Analysis Server = {$server}</Label>
  
  <Input id="server_input" bind:value={new_server} />
  <Button on:click={()=>{$server = new_server}}>Set</Button>

</div>


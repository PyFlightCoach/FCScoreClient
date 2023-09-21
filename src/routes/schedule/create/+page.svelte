<script lang="ts">
  import { Label, Input } from 'flowbite-svelte';
  import {schedule} from '$lib/stores';
  let name = schedule.name;
  let sinfo = schedule.sinfo;
  let direction = schedule.direction;
  let mannames = schedule.mannames;

</script>

<div id='container'>
  <div id='schedule'>

    <Label>Schedule Long Name</Label>
    <Input bind:value={$name}/>
    <Label>Category</Label>
    <Input bind:value={$sinfo.category}/>
    <Label>Schedule Short Name</Label>
    <Input bind:value={$sinfo.name}/>
  </div>
  <div id='manoeuvre'>
    manoeuvre INFO
  </div>
</div>


<style>

  #container {
    display: grid;
    grid-template-columns:  1fr 2fr;
    grid-template-rows: 1fr 1fr;
  }
  #schedule {
    grid-column: 1;
    grid-row: 1;
  }
  #manoeuvre {
    grid-column: 1;
    grid-row: 2;
  }

</style>
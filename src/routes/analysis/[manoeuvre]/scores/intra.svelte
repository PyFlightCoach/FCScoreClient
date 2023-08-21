<script lang="ts">
  export let intra: ElementsResults;
  export let state: State[];
  export let intended: State[];
  import { Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import type {ElementsResults, Result} from '$lib/api_objects';
  import IntraPlot from './intra_plot.svelte';
  import {split_states, type State} from '$lib/geometry';

  let all_fields: string[];
  $: all_fields = [];

  $: Object.values(intra.data).forEach((results) => {
    Object.values(results.data).forEach(result => {
      all_fields.push(result.name)
    });
  });

  $: unique_fields = [...new Set(all_fields)];


  $: states = split_states(state);
  $: templates = split_states(intended);

  let popopen=false;
  let target_el: string;
  let target_field: string;
  const openpop =(el:string, field: string) => {
    popopen=false;
    target_el = el;
    target_field = field;
    popopen = true;    
    const pl = document.querySelector('#plot');
    if (pl) {pl.scrollIntoView({behavior: 'smooth'});}
  }


</script>


<Table hoverable={true} >
  <TableHead>
    <TableHeadCell>Element</TableHeadCell>
    {#each unique_fields as unfn}
      <TableHeadCell>{unfn}</TableHeadCell>
    {/each}
    <TableHeadCell>Total</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each Object.entries(intra.data) as [name, result] }
      <TableBodyRow>
        <TableBodyCell>{name}</TableBodyCell>
        {#each unique_fields as unfn}
          <TableHeadCell on:click={(event)=>openpop(name, unfn)}>
            {#if unfn in result.data}
              {result.data[unfn].value.toFixed(2)}
            {:else}
              -
            {/if}
          </TableHeadCell>
        {/each}
        <TableBodyCell>{result.value.toFixed(2)}</TableBodyCell>
      </TableBodyRow>
    {/each}

  </TableBody>
</Table>
<div id='plot'></div>
{#if popopen}
  
  <IntraPlot 
    result={intra.data[target_el].data[target_field]} 
    flown={states[target_el]}
    template={templates[target_el]}
  />
{/if}


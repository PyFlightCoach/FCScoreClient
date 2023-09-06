<script lang="ts">
  export let intra: ElementsResults;
  export let state: State[];
  export let intended: State[];
  export let manoeuvre: Record<string, Any>;

  import { Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import type {ElementsResults, Result} from '$lib/api_objects';
  import IntraPlot from './intra_plot.svelte';
  import {split_states, type State} from '$lib/geometry';
  import { Tooltip } from 'flowbite-svelte';
  
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

  function getEl(ename: string, man: Record<string, any>) {
    if (ename == 'entry_line') {
      return man.entry_line;
    }
    for (let i=0; i<man.elements.length; i++) {
      if (man.elements[i].uid == ename) {
        return man.elements[i];
      }
    }
  }

  function remove_ret(name:string, data: Record<string, any>) {
    let outp: Record<string, any> = {};
    Object.entries(data).forEach(v=>{
      if (v[0] != name) {
        outp[v[0]] = v[1];
      }
    });
    return outp;
  }

  function elInfo(name: string, man: Record<string, any>) {
    const el = remove_ret('scoring', getEl(name, man));

    function format(input: any) {
      if (typeof input == 'number') {
        return input.toFixed(2)
      } else {
        return String(input)
      }
    }

    return Object.entries(el).map(
      row=>String(row[0]) + '=' + format(row[1])
    );
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
          <TableBodyCell on:click={(event)=>openpop(name, unfn)}>
            {#if unfn in result.data}
              {result.data[unfn].total.toFixed(2)}
            {:else}
              -
            {/if}
          </TableBodyCell>
        {/each}
        <TableBodyCell>{result.total.toFixed(2)}</TableBodyCell>
      </TableBodyRow>
      <Tooltip>
        {#each elInfo(name, manoeuvre) as info}
          {info}
          <br>
        {/each}
      </Tooltip>
    {/each}

  </TableBody>
</Table>

{#if popopen}
  
  <IntraPlot 
    result={intra.data[target_el].data[target_field]} 
    flown={states[target_el]}
    template={templates[target_el]}
    element={getEl(target_el, manoeuvre)}
  />
{/if}

<div id='plot'></div>
<script lang="ts">
  export let man: Record<string, any> = {};
  import PlotState from '$lib/plotState.svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import Result from 'postcss/lib/result';


  $: all_fields = [];

  $: Object.values(man.score.intra.data).forEach((results) => {
    Object.values(results.data).forEach(result => {
      all_fields.push(result.name)
    });
  });

  $: unique_fields = [...new Set(all_fields)];

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
    {#each Object.entries(man.score.intra.data) as [name, result] }
      <TableBodyRow>
        <TableBodyCell>{name}</TableBodyCell>
        {#each unique_fields as unfn}
          <TableHeadCell on:click={(event)=>console.log(name + ', ' + unfn)}>
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




<script lang="ts">
	

  export let results: Results;
  export let state: State[];
  export let info: ManInfo[];

  import {split_states, type State, Point} from '$lib/geometry';
  import type { Results, ManInfo } from "$lib/api_objects";
  import { Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import Plotly from '$lib/plots/Plotly.svelte'; 
  import {coloured_ribbons, criteria_info, single_point, downgrade_info} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';
  
  $: sts = split_states(state)

  
  //$: points: Point[] = [];

</script>

<div>

  <Table hoverable={true}>
    <TableHead>
        <TableHeadCell>name</TableHeadCell>
        <TableHeadCell>Error</TableHeadCell>
        <TableHeadCell>Downgrade</TableHeadCell>
    </TableHead>

    {#each Object.values(results.data) as pos}
        <TableBodyRow>
            
            <TableBodyCell>{pos.name}</TableBodyCell>
            {#if pos.name=="distance"}
              <TableBodyCell>{pos.errors[0].toFixed(0)} m;</TableBodyCell>
            {:else}
              <TableBodyCell>{(pos.errors[0] * 180 / Math.PI).toFixed(2)} &deg</TableBodyCell>
            {/if}
            <TableBodyCell>{pos.total.toFixed(2)}</TableBodyCell>
        </TableBodyRow>
    {/each}
  </Table>

  <Plotly data={coloured_ribbons(sts,2)} layout={layout3d}/>
</div>
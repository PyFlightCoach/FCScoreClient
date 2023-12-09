
<script lang="ts">
	

  export let results: Results;
  export let state: State[];
  export let info: ManInfo;

  import {split_states, type State, Point} from '$lib/geometry';
  import type { Results, ManInfo } from "$lib/api_objects";
  import { Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import Plot from 'svelte-plotly.js';
  import {coloured_ribbons, criteria_info, points, boxtrace} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';
  

  $: sts = split_states(state)

  const get_points = (states: Record<string, State[]>) => {
    let sts: State[][] = Object.values(states);
    return info.centre_points.map(i=>{
      let el = sts[i].at(-1);
      return el.pos();
    })
  }

  const get_el_points = (states: Record<string, State[]>) => {
    let sts: State[][] = Object.values(states);
    return info.centred_els.map(i=>{
      let el = sts[i[0]+1];
      return el[Math.round(i[1] * el.length)].pos()
    })
  }

  $: centre_points = get_points(sts);
  $: el_points = get_el_points(sts);
  // , info.centre_points.map(i=>'centre point '.concat(i.toString()))
  // info.centred_els.map(i=>'centred element '.concat(i[0].toString()))
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

  <Plot 
    data={
      coloured_ribbons(sts,2)
      .concat(points(centre_points, info.centre_points.map(i=>'centre point '.concat(i.toString())) )) 
      .concat(points(el_points, info.centred_els.map(i=>'centred el '.concat(i[0].toString()))))
      .concat([boxtrace()])
    } 
    layout={layout3d}
    fillParent={true}
  />

</div>
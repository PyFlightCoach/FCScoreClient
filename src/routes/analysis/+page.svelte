<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
  import {flightdata} from '$lib/stores';
  let mannames = flightdata.mannames;

  

</script>

<Table>
  <TableHead>
    <TableHeadCell>Manoeuvre</TableHeadCell>
    <TableHeadCell>K Factor</TableHeadCell>
    <TableHeadCell>Status</TableHeadCell>
    <TableHeadCell>Score</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each $mannames as manname}
      <TableBodyRow>
        <TableBodyCell>{manname}</TableBodyCell>
        <TableBodyCell>3</TableBodyCell>
        <TableBodyCell>Read</TableBodyCell>
        <TableBodyCell>-</TableBodyCell>
      </TableBodyRow>

    {/each}
  </TableBody>
</Table>
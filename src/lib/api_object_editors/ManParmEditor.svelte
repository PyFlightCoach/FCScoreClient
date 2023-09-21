<script lang="ts">
    import type {ManParm} from '$lib/api_objects';
    export let mps: Record<string, ManParm>;
    import { Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

</script>


<Table hoverable={true} >
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Kind</TableHeadCell>
      <TableHeadCell>Default</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each Object.values(mps) as mp }
        <TableBodyRow>
          <TableBodyCell>{mp.name}</TableBodyCell>
          <TableBodyCell>{mp.criteria.kind}</TableBodyCell>
          <TableBodyCell>{mp.defaul}</TableBodyCell>
        </TableBodyRow>
      {/each}
  
    </TableBody>
  </Table>
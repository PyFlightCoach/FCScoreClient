<script lang='ts'>
	import type { ManDef, Results } from "$lib/api_objects";
    import type {State} from '$lib/geometry';
    import {P} from 'flowbite-svelte';
    import { AccordionItem, Accordion } from 'flowbite-svelte';
    import { Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    export let inter: Results;
    export let state: State;
    export let mdef: ManDef;



    function collid(mpname: string, collname: string) {
        return inter.data[mpname].keys.findIndex(v=>v==collname);
    }


</script>

<Accordion>

    {#each Object.values(mdef.mps) as mp}
        
        <AccordionItem>
            <span slot="header">{mp.name}</span>
            {#if mp.name in inter.data}
            
                <Table hoverable={true}>
                    <TableHead>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Collector</TableHeadCell>
                        <TableHeadCell>Value</TableHeadCell>
                        <TableHeadCell>Error</TableHeadCell>
                        <TableHeadCell>Downgrade</TableHeadCell>
                    </TableHead>
                </Table>
                {#each Object.entries(mp.collectors) as co}
                    <TableBodyRow>
                        <TableBodyCell>{co[0]}</TableBodyCell>
                        <TableBodyCell>{inter.data[mp.name].errors[collid(mp.name, co[1])]}</TableBodyCell>
                        <TableBodyCell>test</TableBodyCell>
                        <TableBodyCell></TableBodyCell>
                        <TableBodyCell></TableBodyCell>
                    </TableBodyRow>
                {/each}
            {:else}
                <P>This parameter is not downgradable. Usually this is because it is covered by the 
                    intra element scoring, the parameter is just used to create the templates.
                </P>
            {/if}
        </AccordionItem>

        
    {/each}
</Accordion>
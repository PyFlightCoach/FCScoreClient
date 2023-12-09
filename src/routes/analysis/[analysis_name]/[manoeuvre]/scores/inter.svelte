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

    function colinfo(mp: Record<string, any>) {
        return Object.values(mp.collectors).map(co=>{
            let colid = collid(mp.name, co);
            return [
                co,
                inter.data[mp.name].sample[colid].toFixed(2),
                inter.data[mp.name].errors[colid].toFixed(2),
                inter.data[mp.name].measurement.visibility[colid].toFixed(2),
                inter.data[mp.name].dgs[colid].toFixed(2),
            ]
        })
    }

</script>

<Accordion>

    {#each Object.values(mdef.mps) as mp}
        
        <AccordionItem>
            <span slot="header">{mp.name} (dg={mp.name in inter.data ? inter.data[mp.name].total.toFixed(2) : 0})</span>
            {#if mp.name in inter.data}
            
                <Table hoverable={true}>
                    <TableHead>
                        <TableHeadCell>Collector</TableHeadCell>
                        <TableHeadCell>Value</TableHeadCell>
                        <TableHeadCell>Error</TableHeadCell>
                        <TableHeadCell>Visibility</TableHeadCell>
                        <TableHeadCell>Downgrade</TableHeadCell>
                    </TableHead>
                
                    {#each colinfo(mp) as co}
                        <TableBodyRow>
                            {#each co as cocell}
                            <TableBodyCell>{cocell}</TableBodyCell>
                            {/each}
                        </TableBodyRow>
                    {/each}
                </Table>
            {:else}
                <P>This parameter is not downgradable. Usually this is because it is covered by the 
                    intra element scoring, the parameter is just used to create the templates.
                </P>
            {/if}
        </AccordionItem>

        
    {/each}
</Accordion>
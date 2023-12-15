<script lang='ts'>
    import { flightdata } from '$lib/stores';
    import {States} from '$lib/geometry';
    import {P} from 'flowbite-svelte';
    import { AccordionItem, Accordion } from 'flowbite-svelte';
    import { Table, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    export let data;

    $: man = flightdata.mans[data.mname];
  
    $: state = new States($man.al);
    $: states = state.split();


    function collid(mpname: string, collname: string) {
        return $man.score.inter.data[mpname].keys.findIndex(v=>v==collname);
    }

    function colinfo(mp: Record<string, any>) {
        return Object.values(mp.collectors).map(co=>{
            let colid = collid(mp.name, co);
            return [
                co,
                $man.score.inter.data[mp.name].sample[colid].toFixed(2),
                $man.score.inter.data[mp.name].errors[colid].toFixed(2),
                $man.score.inter.data[mp.name].measurement.visibility[colid].toFixed(2),
                $man.score.inter.data[mp.name].dgs[colid].toFixed(2),
            ]
        })
    }

</script>

<Accordion>

    {#each Object.values($man.mdef.mps) as mp}
        
        <AccordionItem>
            <span slot="header">{mp.name} (dg={mp.name in $man.score.inter.data ? $man.score.inter.data[mp.name].total.toFixed(2) : 0})</span>
            {#if mp.name in $man.score.inter.data}
            
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
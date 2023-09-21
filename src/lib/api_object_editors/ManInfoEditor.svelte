<script lang='ts'>
    import {ManInfo, BoxLocation, Heights, Directions, Orientations, Positions} from '$lib/api_objects';
    import { Label, Input, Select } from 'flowbite-svelte';

    export let info: ManInfo = ManInfo.default();
    
    function create_items(_enum: any) {
        return _enum.map(v=>{return {value: v, name: v}})
    }

</script>

<div>
    <Label>Name</Label><Input type="text" bind:value={info.name} />
    <Label>Short Name</Label><Input type="text" bind:value={info.short_name} />
    <Label>K Factor</Label><Input type="number" bind:value={info.k} />
    <Label>Position</Label><Select items={create_items(Positions)} bind:value={info.position} />
    <Label>Start Height</Label><Select items={create_items(Heights)} bind:value={info.start.h} />
    <Label>Start Direction</Label><Select items={create_items(Directions)} bind:value={info.start.d} />
    <Label>Start Orientation</Label><Select items={create_items(Orientations)} bind:value={info.start.o} />
    <Label>End Height</Label><Select items={create_items(Heights)} bind:value={info.end.h} />
</div>
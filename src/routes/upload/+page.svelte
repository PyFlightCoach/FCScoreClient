<script lang="ts">
    import { Fileupload, Label, Button } from 'flowbite-svelte'
    import {convert_fcj} from '$lib/api_calls';

    let value: any;
    let data: Record<string, any>;
    import { flightdata } from '$lib/stores.js';
    import { State} from '$lib/geometry';

	let sinfo = flightdata.sinfo;
    let direction = flightdata.direction;
    
    function readjson(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.name.split('.').pop() == "json") {
                value=file.name;
                let fr = new FileReader();
                fr.onload = (event) => {
                    data=JSON.parse(event.target.result);
                    $sinfo = {
                        category: data.parameters.schedule[0], 
                        name: data.parameters.schedule[1]
                    };
                };
                console.log(file);
                fr.readAsText(file);
    }}}

    const convert_json = () => {
        if (data) {
            convert_fcj(data, $sinfo)
            .then((res: Record<string, any>) => {
                for (const [key, value] of Object.entries(res)) {
                    value['busy'] = false;
                    flightdata.addMan(key).set(value);
                    if (Object.keys(flightdata.mans).length == 1) {
                        $direction = State.parse(value.fl[0]).direction()
                    }
                }
            });
        }
    }


</script>

<div>
    <Label>
        {#if value}
            <p>{value}</p>
        {:else}
            <p>select a Flight Coach json file</p>
        {/if}
    </Label>
    <Fileupload on:change={readjson}/>
    
</div>


{#if value}
    {#if $sinfo}
        <p>category={$sinfo.category}</p> 
        <p>schedule={$sinfo.name}</p>
        <Button on:click={convert_json} href='/analysis'>
            Prepare Analysis
        </Button>
    {/if}
{/if}

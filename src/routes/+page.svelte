<script lang="ts">
    import { Fileupload, Label, Button } from 'flowbite-svelte'
    import {convert_fcj} from '$lib/api_calls';

    let value: any;
    let data: Record<string, any> = {};
    
    let processed_data: Record<string, any> = {};

    function readjson(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.name.split('.').pop() == "json") {
                value=file.name;
                let fr = new FileReader();
                fr.onload = (event) => {data=JSON.parse(event.target.result);};
                console.log(file)
                fr.readAsText(file);
    }}}


    const convert_json = () => {
        if (data) {
            convert_fcj(data, {'category': "F3A", 'name': 'P23'})
            .then((data) => {processed_data = data;});
            //window.location.href = '/align';
        }
    }


</script>

{#if Object.keys(processed_data).length > 0}
    alignment
{:else}
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
    <Button on:click={convert_json}>
        Prepare Analysis
    </Button>
    {/if}

{/if}
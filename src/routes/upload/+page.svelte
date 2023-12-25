<script lang="ts">
  import { Fileupload, Label, Button } from 'flowbite-svelte'
  import {convert_fcj} from '$lib/api_calls';
  import {ReadMan} from '$lib/api_objects/mandata';
  let data: Record<string, any>;
  import { flightdata } from '$lib/stores.js';
  import { State} from '$lib/geometry';

  let name = flightdata.name;
	let sinfo = flightdata.sinfo;
  
  function readjson(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.name.split('.').pop() == "json") {
        let fr = new FileReader();
        fr.onload = (event) => {
          data=JSON.parse(event.target.result);
          $sinfo = {
            category: data.parameters.schedule[0], 
            name: data.parameters.schedule[1]
          };
          $name=data.name.replace(/\.[^/.]+$/, "");
        };
        console.log(file);
        fr.readAsText(file);
  }}}

  const convert_json = () => {
    if (data) {
      convert_fcj(data, $sinfo).then((res: Record<string, any>) => {
        for (const [key, value] of Object.entries(res)) {
          flightdata.addMan(key, ReadMan.parse(value));
        }
      });
    }
  }


</script>

<div>
  <Label>
    {#if $name}
      <p>{$name}</p>
    {:else}
      <p>select a Flight Coach json file</p>
    {/if}
  </Label>
  <Fileupload on:change={readjson}/>
  
</div>

{#if $name}
  <p>category={$sinfo.category}</p> 
  <p>schedule={$sinfo.name}</p>
  <Button on:click={convert_json} href={'/analysis/' + $name}>
    Prepare Analysis
  </Button>
{/if}

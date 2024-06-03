<script lang="ts">
  import { Fileupload, Label, Button } from 'flowbite-svelte'
  import {convert_fcj} from '$lib/api_calls';
  import {BasicMan} from '$lib/api_objects/mandata';
  let data: Record<string, any>;
  import { flightdata } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths'
  import { Alert } from 'flowbite-svelte';

  let name = flightdata.name;
	let sinfo = flightdata.sinfo;
  let warning=false;

  const fcj_schedule_names = {
      'f3a': ['F3A', 'F3A FAI'],
      'nsrca': ['F3A US'],
      'f3auk': ['F3A UK'],
      'imac': ['IMAC']
  }


  function readjson(event) {
    flightdata.clear();
    warning=false;
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.name.split('.').pop() == "json") {
        let fr = new FileReader();
        fr.onload = (event) => {
          data=JSON.parse(event.target.result);

          if ('comments' in data) {

            let schname: string = data.parameters.schedule[0];
            for (const [key, value] of Object.entries(fcj_schedule_names)) {
              if (value.includes(data.parameters.schedule[0])) {
                schname = key;
                break;
              }
            }

            $sinfo = {
              category: schname, 
              name: data.parameters.schedule[1]
            };
            $name=data.name.replace(/\.[^/.]+$/, "");

          } else if ('client_version' in data) {

            flightdata.import(data);
            goto(base + '/analysis');

          } else {
            warning=true;
          }
          
        };
        console.log(file);
        fr.readAsText(file);
  }else{warning=true;}}}

  const convert_json = () => {
    if (data) {
      convert_fcj(data, $sinfo).then((res: Record<string, any>) => {
        for (const [key, value] of Object.entries(res)) {
          flightdata.addMan(key, BasicMan.parse(value));
        }
      });
    }
  }


</script>


<div class ='centered'>
  <div >
    <Label>
      {#if $name}
        <p>{$name}</p>
      {:else}
        <p>select a Flight Coach json file or a FCScore Analysis json file</p>
      {/if}
    </Label>
    <Fileupload on:change={readjson}/>
    {#if warning}
      <Alert>This file doesn't look like a FC json or a FCScore json</Alert>
    {/if}
  </div>

  {#if $name}
    <p>category={$sinfo.category}</p> 
    <p>schedule={$sinfo.name}</p>
    <Button on:click={convert_json} href={base}/analysis>
      Prepare Analysis
    </Button>
  {/if}
</div>

<style>
  .centered { 
    position: fixed;
    top: 20%;
    left: 50%;
    width: 50%;
    transform: translate(-50%, -50%);
  }
</style>
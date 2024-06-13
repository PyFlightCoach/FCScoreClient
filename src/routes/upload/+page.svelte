<script lang="ts">
  import { Fileupload, Label, Button, P } from 'flowbite-svelte'
  import {Man} from '$lib/api_objects/mandata';
  import { flightdata } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths'
  import { Alert } from 'flowbite-svelte';
  import { FCJson} from '$lib/fcjson';

  let fcj = flightdata.fcj;
  let warning=false;
  let warning_msg = '';

  function readjson(event) {
    flightdata.clear();
    warning=false;
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.name.split('.').pop() == "json") {
        let fr = new FileReader();
        fr.onload = (event) => {
          try {
            $fcj = FCJson.parse(JSON.parse(event.target.result))

            $fcj.unique_names.slice(1,-1).forEach(
              (name: string,i: number) => {
              flightdata.addMan(name,new Man(false,i,name))
              }
            );
            
            goto(base+'/analysis');

          } catch (err) {
            warning=true;
            warning_msg=err.message;
          }
            
        };
        console.log(file);
        fr.readAsText(file);
  }else{warning=true;}}}

</script>


<div class ='centered'>
  <div >
    <Label>
      {#if $fcj}
        <p>{$fcj.name}</p>
      {:else}
        <p>select a Flight Coach json file or a FCScore Analysis json file</p>
      {/if}
    </Label>
    <Fileupload on:change={readjson}/>
    {#if warning}
      <Alert>This file doesn't look like a FC json or a FCScore json</Alert>
      <P>{warning_msg}</P>
    {/if}
  </div>

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
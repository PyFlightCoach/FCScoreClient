<script lang="ts">
  import { Fileupload, Label, Button, P } from 'flowbite-svelte'
  import { fcj, direction, clearFlight, internals, selectedResult} from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths'
  import { Alert } from 'flowbite-svelte';
  import { FCJson} from '$lib/api_objects/fcjson';
  import {serverFunc} from '$lib/api_calls';
  import  type { Writable} from 'svelte/store';

  let warning_msg: string | null = null;

  function readjson(event) {
    clearFlight();
    
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.name.split('.').pop() == "json") {
        let fr = new FileReader();
        fr.onload = (event) => {
          $fcj = FCJson.parse(JSON.parse(event.target.result));
          $internals = Array($fcj.mans.length);
          $direction = 0;
          serverFunc(
            'calculate_direction', 
            {
              heading: $fcj.origin.heading, 
              data: $fcj.data[$fcj.mans[1].start]
            }, 
            'POST'
          ).then(res=>$direction=res);
          if ($fcj.fcs_scores.length > 0) {
            $selectedResult = $fcj.fcs_scores[$fcj.fcs_scores.length-1].fa_version;
          }
        };
        console.log(file);
        fr.readAsText(file);
  }}}

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
    {#if warning_msg}
      <Alert>This file doesn't look like a FC json</Alert>
      <P>{warning_msg}</P>
    {/if}
    {#if $fcj}
      {#if $direction === undefined}
        <P>Unable to calculate direction</P>
      {:else if $direction === 0}
        <P>Calculating direction ...</P>
      {:else}
        <P>{$direction > 0 ? 'left to right' : 'right to left'}</P>
        <Button on:click={()=>goto(base + '/analysis')}>Continue</Button>
      {/if}
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
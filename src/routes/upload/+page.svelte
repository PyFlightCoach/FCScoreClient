<script lang="ts">
  import { Fileupload, Label, Button, P, Radio } from 'flowbite-svelte'
  import {Man} from '$lib/api_objects/mandata';
  import { flightdata , get_value} from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths'
  import { Alert } from 'flowbite-svelte';
  import { FCJson} from '$lib/fcjson';
  import {calculate_direction} from '$lib/api_calls';
  import  type { Writable} from 'svelte/store';

  let fcj = flightdata.fcj;
  let direction = flightdata.direction;
  let active_result: number = null;
  let warning_msg: string | null = null;

  function readjson(event) {
    flightdata.clear();
    
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.name.split('.').pop() == "json") {
        let fr = new FileReader();
        fr.onload = (event) => {
          //try {
            $fcj = FCJson.parse(JSON.parse(event.target.result))
            
            calculate_direction($fcj.origin, $fcj.data[$fcj.mans[1].start]).then(res=>$direction=res);
            
            $fcj.unique_names.slice(1,-1).forEach(
              (name: string,i: number) => {
                flightdata.addMan(name,new Man(false,i,name));
              }
            );
            
          //} catch (err) {
          //  warning_msg=err.message;
          //}
            
        };
        console.log(file);
        fr.readAsText(file);
  }}}

  $: {if (active_result !== null) {
    Object.values(flightdata.mans).forEach((man: Writable<Man>, i: number) => {
      man.update(v=>v.update({
        score:$fcj!.fcs_scores[active_result].manresults[i+1].score,
        els:$fcj!.fcs_scores[active_result].manresults[i+1].els,
      }));
    });
    flightdata.mannames.update((v)=>
      {
        let newmn: Record<string, number> = {};
        Object.entries(v).forEach(([k, v], i)=>{
          newmn[k] = $fcj!.fcs_scores[active_result].manresults[i+1].score.total * $fcj!.fcs_scores[active_result].manresults[i+1].score.k 
        })
        return newmn;
      }
    );

  }}


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
      {#if $direction===0}
        <P>Unable to calculate direction</P>
      {:else}
        <P>{$direction > 0 ? 'left to right' : 'right to left'}</P>
        {#if $fcj.fcs_scores.length > 0}
          <div class='container' >
            <div>id</div>
            <div>Version</div>
            <div>Date</div>
            <div>Difficulty</div>
            <div>Total</div>
            <div>Select</div>
          {#each $fcj.fcs_scores as fcscore, i}
              <div>{i+1}</div>
              <div>{fcscore.fcs_version}</div>
              <div>{fcscore.date}</div>
              <div>{fcscore.difficulty}</div>
              <div>{fcscore.total.toFixed(2)}</div>
              <Radio name='analysis' value={i} bind:group={active_result }/>
          {/each}
          </div>
          {#if active_result !== null}
            <P>Active Result =  {active_result}</P>
          {:else}
            <P>No result selected</P>
          {/if}
        {/if}
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

  .container {
    width: 100%; 
    display:grid;  
    align-content: start; 
    justify-content: start;
    grid-template-columns: repeat(6,1fr);
  }
</style>
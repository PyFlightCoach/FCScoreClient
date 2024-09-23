

<script lang="ts">
  import { analyses, selManID, fcj, fa_version } from '$lib/stores';
  import {analyseManoeuvre} from '$lib/analysis';
  import {Tooltip, Select, ButtonGroup, Button, NumberInput} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import PlotDTW from '$lib/plots/PlotDTW.svelte';
	import { MA } from '$lib/api_objects/ma';
  
  $: man = analyses[$selManID];

  let step: number = 0.5;
  
  $: elements = $man?.flown.elements();
  $: end_info = $man?.flown.end_info();
  
  let element: string|null = null

  const editsplit = (stp: number, elname: string | null) => {
    
    if (elname == null) return; 
    const elindex = elements.indexOf(elname);
    let i=0;
    if (stp>0) {
      const endt = Math.min(
        end_info[elname].lastt + stp, 
        end_info[elements[elindex+1]].lastt - 0.1
      );
      while ($man.flown.data[end_info[elements[elindex]].lastid + i].t < endt) {
        $man.flown.data[end_info[elements[elindex]].lastid + i].element = elname; 
        i++;
      }

    } else {
      const endt = Math.max(
        end_info[elname].lastt + stp, 
        end_info[elname].firstt + 0.1
      );
      while ($man.flown.data[end_info[elements[elindex]].lastid - i].t > endt) {
        $man.flown.data[end_info[elements[elindex]].lastid - i].element = elements[elindex+1]; i++;
      }
    }
    let history = $man.history;
    delete history[$fa_version];
    $man = new MA(
      $man.name, $man.id, $man.start, $man.stop, $man.schedule, $man.scheduleDirection, $man.flown, history, $man.k
    );
    delete $fcj?.get_result($fa_version)?.manresults[$selManID];
  };

  $: states = $man?.flown.split();

</script>

{#if $man}
<div>
  <div style:height=100%>
    <PlotDTW sts={states} bind:activeEl={element} sp={3}/>
  </div>
  <div id='buttons'>
    <ButtonGroup>
      <Select  id="selectelement"
        bind:value={element} 
        items={['Select Element'].concat(...Object.keys(states)).map((el) => {return {value: el, name: el};})}
      />
      <NumberInput  id="stepsize" bind:value={step} step=0.1/>
      <Button  id="adjustback" on:click={() => {editsplit(-Number(step), element)}}>&#60</Button>
      <Button  id="adjustfor" on:click={() => {editsplit(Number(step), element)}}>&#62</Button>
      <Button  id="optimse" on:click={()=>{analyseManoeuvre($selManID, true, true)}}>Optimise</Button>
      <Button  id="score" on:click={()=>{analyseManoeuvre($selManID, false, true)}}>Score</Button>
      <Button  id="back" on:click={() => {goto('/analysis/')}}>back</Button>
    </ButtonGroup>
  </div>
  <Tooltip triggeredBy="[id='stepsize']">Enter step size in seconds</Tooltip>
  <Tooltip triggeredBy="[id='selectelement']">Select element to edit or click ribbon</Tooltip>
  <Tooltip triggeredBy="[id='adjustback']">Adjust split location backwards</Tooltip>
  <Tooltip triggeredBy="[id='optimse']">Run aligment optimisation</Tooltip>
  <Tooltip triggeredBy="[id='score']">Recalculate score without optimisation</Tooltip>
  <Tooltip triggeredBy="[id='adjustfor']">Adjust split location forwards</Tooltip>
  <Tooltip triggeredBy="[id='back']">Back to Main Page</Tooltip>
</div>
{:else}
  <p>No Internal Data</p>
{/if}

<style>
  #buttons {position: absolute; bottom: 0;right: 0;}
</style>
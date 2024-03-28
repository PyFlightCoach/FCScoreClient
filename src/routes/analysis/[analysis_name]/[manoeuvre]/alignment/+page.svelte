

<script lang="ts">
  import { flightdata } from '$lib/stores';
  import {BasicMan, AlignedMan, type ScoredMan} from '$lib/api_objects/mandata';
  import {Tooltip, Input, BottomNavItem, BottomNav, Select, ScoreRating} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import PlotDTW from '$lib/plots/PlotDTW.svelte';
  export let data;

  let man = flightdata.mans[data.mname];
  let mannames = flightdata.mannames;
  let step: number = 0.1;
  
  $: elements = $man.flown.elements();
  $: end_info = $man.flown.end_info();
  
  let element: string|null = null

  const editsplit = (stp: number, elname: string) => {

    man.update((val: BasicMan | AlignedMan | ScoredMan) => {
      $mannames[data.mname]=2;
      
      console.log(data.mname);
      const elindex = elements.indexOf(elname);
      let i=0;
      if (stp>0) {
        const endt = Math.min(
          end_info[elname].lastt + stp, 
          end_info[elements[elindex+1]].lastt - 0.1
        );
        while (val.flown.data[end_info[elements[elindex]].lastid + i].t < endt) {
          val.flown.data[end_info[elements[elindex]].lastid + i].element = elname; i++;
        }

      } else {
        const endt = Math.max(
          end_info[elname].lastt + stp, 
          end_info[elname].firstt + 0.1
        );
        while (val.flown.data[end_info[elements[elindex]].lastid - i].t > endt) {
          val.flown.data[end_info[elements[elindex]].lastid - i].element = elements[elindex+1]; i++;
        }
      }
      return new AlignedMan(false, val.mdef, val.flown, val.direction, val.stage, val.manoeuvre, val.template);
    });
  };


  $: states = $man.flown.split();

</script>


<div>
  <div style:height=100%>
    <PlotDTW sts={states} bind:activeEl={element} sp={3}/>
  </div>
  <BottomNav classInner="grid-cols-5" >
    <Select  id="selectelement"
      bind:value={element} 
      items={['Select Element'].concat(...Object.keys(states)).map((el) => {return {value: el, name: el};})}
    />
    <BottomNavItem id="stepsize"><Input placeholder='step' bind:value={step}/></BottomNavItem>
    <BottomNavItem  id="adjustback" on:click={() => {editsplit(-Number(step), element)}}>&#60</BottomNavItem>
    <BottomNavItem  id="adjustfor" on:click={() => {editsplit(Number(step), element)}}>&#62</BottomNavItem>
    <BottomNavItem  id="back" on:click={() => {goto('/analysis/'+data.analysis_name)}}>back</BottomNavItem>
  </BottomNav>
  <Tooltip triggeredBy="[id='stepsize']">Enter step size in seconds</Tooltip>
  <Tooltip triggeredBy="[id='selectelement']">Select element to edit</Tooltip>
  <Tooltip triggeredBy="[id='adjustback']">Adjust split location backwards</Tooltip>
  <Tooltip triggeredBy="[id='adjustfor']">Adjust split location forwards</Tooltip>
  <Tooltip triggeredBy="[id='back']">Back to Main Page</Tooltip>
</div>



<script lang="ts">
  import { analyseManoeuvre, internals, activeManoeuvre, fcj, fa_version } from '$lib/stores';
  import {Tooltip, Input, BottomNavItem, BottomNav, Select} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import PlotDTW from '$lib/plots/PlotDTW.svelte';
	import { Internals } from '$lib/api_objects/mandata';
  
  $: manid = $fcj?.unique_names.indexOf($activeManoeuvre!);
  $: man = $internals![manid!];

  let step: number = 0.1;
  
  $: elements = man.flown.elements();
  $: end_info = man.flown.end_info();
  
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
      while (man.flown.data[end_info[elements[elindex]].lastid + i].t < endt) {
        man.flown.data[end_info[elements[elindex]].lastid + i].element = elname; 
        i++;
      }

    } else {
      const endt = Math.max(
        end_info[elname].lastt + stp, 
        end_info[elname].firstt + 0.1
      );
      while (man.flown.data[end_info[elements[elindex]].lastid - i].t > endt) {
        man.flown.data[end_info[elements[elindex]].lastid - i].element = elements[elindex+1]; i++;
      }
    }
    $internals![manid!] = new Internals(man.mdef,man.flown)
    delete $fcj?.get_result($fa_version)?.manresults[manid!];
  };


  $: states = man.flown.split();

</script>


<div>
  <div style:height=100%>
    <PlotDTW sts={states} bind:activeEl={element} sp={3}/>
  </div>
  <BottomNav id=bnav classInner="grid-cols-7"  >
    <Select  id="selectelement"
      bind:value={element} 
      items={['Select Element'].concat(...Object.keys(states)).map((el) => {return {value: el, name: el};})}
    />
    <BottomNavItem id="stepsize"><Input placeholder='step' bind:value={step}/></BottomNavItem>
    <BottomNavItem  id="adjustback" on:click={() => {editsplit(-Number(step), element)}}>&#60</BottomNavItem>
    <BottomNavItem  id="adjustfor" on:click={() => {editsplit(Number(step), element)}}>&#62</BottomNavItem>
    <BottomNavItem  id="optimse" on:click={()=>analyseManoeuvre($activeManoeuvre, true, true, true)}>Optimise</BottomNavItem>
    <BottomNavItem  id="score" on:click={()=>analyseManoeuvre($activeManoeuvre, true, false, true)}>Score</BottomNavItem>
    <BottomNavItem  id="back" on:click={() => {goto('/analysis/')}}>back</BottomNavItem>
  </BottomNav>
  <Tooltip triggeredBy="[id='stepsize']">Enter step size in seconds</Tooltip>
  <Tooltip triggeredBy="[id='selectelement']">Select element to edit</Tooltip>
  <Tooltip triggeredBy="[id='adjustback']">Adjust split location backwards</Tooltip>
  <Tooltip triggeredBy="[id='optimse']">Run aligment optimisation</Tooltip>
  <Tooltip triggeredBy="[id='score']">Recalculate score without optimisation</Tooltip>
  <Tooltip triggeredBy="[id='adjustfor']">Adjust split location forwards</Tooltip>
  <Tooltip triggeredBy="[id='back']">Back to Main Page</Tooltip>
</div>

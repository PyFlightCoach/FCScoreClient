

<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import {alignment_traces} from '$lib/plots/traces';
	import { flightdata, colddraft } from '$lib/stores';
  import {ReadMan, AlignedMan, ScoredMan} from '$lib/api_objects/mandata';
  import {Tooltip, Input, BottomNavItem, BottomNav, Select, ScoreRating} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import {layout3d} from '$lib/plots/layouts';  
  import {split_states} from '$lib/geometry';
  export let data;

  let man = flightdata.mans[data.mname];
  let mannames = flightdata.mannames;

  $: if ($man instanceof ReadMan) {
    goto('/analysis/'+data.analysis_name + '/' + data.mname + '/summary');
  }

  let step: number = 0.1;
  let eid: number | null = null;
  let show_models=false;
  
  $: elements = $man.al.elements();
  $: end_info = $man.al.end_info();
  
  let element = 'Select Element'
  $: if (eid != null) {element = elements[eid]} else {element = 'Select Element'};

  const editsplit = (stp: number, elname: string) => {

    man.update((val) => {
      $mannames[data.mname]=2;

      const elindex = elements.indexOf(elname);
      let i=0;
      if (stp>0) {
        const endt = Math.min(
          end_info[elname].lastt + stp, 
          end_info[elements[elindex+1]].lastt - 0.1
        );
        while (val.al.data[end_info[elements[elindex]].lastid + i].t < endt) {
          val.al.data[end_info[elements[elindex]].lastid + i].element = elname; i++;
        }

      } else {
        const endt = Math.max(
          end_info[elname].lastt + stp, 
          end_info[elname].firstt + 0.1
        );
        while (val.al.data[end_info[elements[elindex]].lastid - i].t > endt) {
          val.al.data[end_info[elements[elindex]].lastid - i].element = elements[elindex+1]; i++;
        }
      }
      return new AlignedMan(val.mdef, false, 0, val.al);
    });
  };

  const change_element = (ename: string) => {
    if (ename == 'Select Element') {
      eid=null; 
      show_models=false;
    } else {
      eid=Object.keys(states).indexOf(ename); 
      show_models=true;
    }
  }

  $: states = $man.al.split();
  $: traces = alignment_traces(states, show_models, false, $colddraft, 1, eid)
  //$: layout = get_ar(traces, 20);


</script>


<div id="parent">
  <Plot 
    data={traces} layout={layout3d} fillParent={true}
    on:click={(e) => {change_element(e.detail.points[0].data.name)}}
  />
  <BottomNav classInner="grid-cols-5" >
    <Select  id="selectelement"
      bind:value={element} 
      items={['Select Element'].concat(...Object.keys(states)).map((el) => {return {value: el, name: el};})}
      on:change={()=>change_element(element)}
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

<style>
  #parent {height: 100%; width:100%; position:fixed}
</style>

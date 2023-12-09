

<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import {alignment_traces} from '$lib/plots/traces';
	import { flightdata, colddraft } from '$lib/stores';
  
  import {Tooltip, Input, BottomNavItem, BottomNav, Select} from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import {layout3d} from '$lib/plots/layouts';  
  import {split_states} from '$lib/geometry';
  export let data;

  $: man = flightdata.mans[data.mname];
  $: manname = $man.mdef.info.short_name;
  let mannames = flightdata.mannames;

  let step: number = 0.1;
  let eid: number | null = null;
  let show_models=false;
  let all_elements: string[];   $: all_elements = $man.al.map((el: Record<string, any>) => el.element);
  let elements: string[];       $: elements = [...new Set(all_elements)];

  $: end_info = Object.fromEntries(elements.map((el) => {
      const lastid = all_elements.lastIndexOf(el);
      const firstid = all_elements.indexOf(el);
      return [el, {lastid: lastid,lastt: $man.al[lastid].t, firstid: firstid, firstt:$man.al[firstid].t}];
  }));
  
  let element = 'Select Element'
  $: if (eid != null) {element = elements[eid]} else {element = 'Select Element'};


  const editsplit = (stp: number, elname: string) => {
    man.update((val) => {
      if ('score' in val) {
        delete val['score'];
        delete val['analysis'];
      }
      $mannames[manname]=2;

      const elindex = elements.indexOf(elname);
      let i=0;
      if (stp>0) {
        const endt = Math.min(
          end_info[elname].lastt + stp, 
          end_info[elements[elindex+1]].lastt - 0.1
        );
        while (val.al[end_info[elements[elindex]].lastid + i].t < endt) {
          val.al[end_info[elements[elindex]].lastid + i].element = elname; i++;
        }

      } else {
        const endt = Math.max(
          end_info[elname].lastt + stp, 
          end_info[elname].firstt + 0.1
        );
        while (val.al[end_info[elements[elindex]].lastid - i].t > endt) {
          val.al[end_info[elements[elindex]].lastid - i].element = elements[elindex+1]; i++;
        }
      }
      return val
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

  $: states = split_states($man['al']);
  $: traces = alignment_traces(states, show_models, false, $colddraft, 1, eid)
</script>


<div id="parent">
  <Plot 
    data={traces} 
    layout={layout3d}
    fillParent={true}
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
    <BottomNavItem  id="back" on:click={() => {goto('/analysis')}}>back</BottomNavItem>
  </BottomNav>
  <Tooltip triggeredBy="[id='stepsize']">Enter step size in seconds</Tooltip>
  <Tooltip triggeredBy="[id='selectelement']">Select element to edit</Tooltip>
  <Tooltip triggeredBy="[id='adjustback']">Adjust split location backwards</Tooltip>
  <Tooltip triggeredBy="[id='adjustfor']">Adjust split location forwards</Tooltip>
  <Tooltip triggeredBy="[id='back']">Back to Main Page</Tooltip>
  
  

</div>

<style>
  #parent {height: 100%; position:fixed}
</style>

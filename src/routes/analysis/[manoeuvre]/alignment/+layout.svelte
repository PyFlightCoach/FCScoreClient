

<script lang="ts">
  import {Tooltip, Input, BottomNav, BottomNavItem, Select} from 'flowbite-svelte';
  let step: number = 0.1;

  import { flightdata } from '$lib/stores.js';
  import {page} from '$app/stores';
	import { goto } from '$app/navigation';
  let dropdownOpen = false;
  let mannames = flightdata.mannames;

  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);

  let all_elements: string[];   $: all_elements = $man.al.map((el: Record<string, any>) => el.element);
  let elements: string[];       $: elements = [...new Set(all_elements)].slice(0, -1);

  $: end_info = Object.fromEntries(elements.map((el) => {
      const lastid = all_elements.lastIndexOf(el);
      const firstid = all_elements.indexOf(el);
      return [el, {lastid: lastid,lastt: $man.al[lastid].t, firstid: firstid, firstt:$man.al[firstid].t}];
  }));
  


  let element = "select element";


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

</script>


<div id="parent">
  <slot id="contents"/>  
  <BottomNav classInner="grid-cols-5" id="adjust-split">
    
    
    <Select bind:value={element} items={elements.map((el) => {return {value: el, name: el};})}/>
    <BottomNavItem><Input placeholder='step' bind:value={step}/></BottomNavItem>

    <BottomNavItem on:click={() => {editsplit(-Number(step), element)}}>&#60</BottomNavItem>
    <BottomNavItem on:click={() => {editsplit(Number(step), element)}}>&#62</BottomNavItem>
    <BottomNavItem on:click={() => {goto('/analysis')}}>back</BottomNavItem>
  </BottomNav>
  <Tooltip triggeredBy="[id='adjust-split']">Select Element, enter step size and use buttons to edit split locations</Tooltip>

</div>

<style>
  #parent {display: flex; flex-direction: row; align-items: stretch; width: 100%; height: 100%; }

  #contents {flex: 1 1 auto;}
</style>

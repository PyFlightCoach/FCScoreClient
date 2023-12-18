
<script lang='ts'>
   
  import { NavContent, flightdata, navitems } from '$lib/stores';
  import {Label, ButtonGroup, Button, Dropdown, DropdownItem, Chevron} from 'flowbite-svelte';
  

  export let data;
  
  $: man = flightdata.mans[data.mname];


  const update_navitems = (man_: Record<string, any>) => {
    navitems.update(v=>{
      let nitems=[];
      nitems.push(new NavContent('Summary', 'summary'))
      if (!man_.busy) {
        if ('al' in man_) {
          nitems.push(new NavContent('Alignment', 'alignment'))
        
          if ('score' in man_) {
            nitems.push(new NavContent('Intra', 'intra'))
            nitems.push(new NavContent('Inter', 'inter'))
            nitems.push(new NavContent('Positioning', 'positioning'))
            nitems.push(new NavContent('Templates', 'templates'))  
          } else {
            nitems.push(new NavContent('Score', '', ()=>flightdata.scoreman(data.mname)))
          }
        } else {
          nitems.push(new NavContent('Align', '', ()=>flightdata.alignman(data.mname)))
        }
      }
      
      return nitems;
    });
  }
  
  $: update_navitems($man);

</script>

{#if !($man == null)}
  <slot />
{/if}


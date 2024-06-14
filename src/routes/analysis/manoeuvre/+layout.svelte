
<script lang='ts'>
   
  import { NavContent, flightdata, navitems, mname } from '$lib/stores';
  import { Man } from '$lib/api_objects/mandata';
  import {base} from '$app/paths';
  import type { PageData } from "./$types";
  import {goto} from '$app/navigation';

  
  $: {if($mname=='') {goto(base + '/analysis')}}

  $: man = flightdata.mans[$mname];

  const update_navitems = (man_: Man) => {
    navitems.update(v=>{
      let nitems=[];
      nitems.push(new NavContent('Summary', base + '/analysis/manoeuvre'));
      if (!man_.busy) {
        if (man_.internals != null) {
          nitems.push(new NavContent('Alignment', base + '/analysis/manoeuvre/alignment'));
          if (man_.scores != null) {
            nitems.push(new NavContent('Intra='+man_.scores.intra.toFixed(2), base + '/analysis/manoeuvre/intra'));
            nitems.push(new NavContent('Inter='+man_.scores.inter.toFixed(2), base + '/analysis/manoeuvre/inter'));
            nitems.push(new NavContent('Positioning='+man_.scores.positioning.toFixed(2), base + '/analysis/manoeuvre/positioning'));
            nitems.push(new NavContent('Templates', base + '/analysis/manoeuvre/templates'));
          } 
        }
      } 
      nitems.push(new NavContent('Back', base + '/analysis/'))
      return nitems;
    });
  }
  
  $: update_navitems($man);

</script>
{#if $man===null || $man.internals===null}
  {#if $man.busy}
    <p>Loading Internal Data</p>
  {:else}
    <p>No Internal Data</p>
  {/if}
{:else}
  <slot />
{/if}


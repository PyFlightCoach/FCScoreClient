
<script lang='ts'>
   
  import { NavContent, navitems, fcj, internals, running, activeManoeuvre, activeResult } from '$lib/stores';
  import type {Internals} from '$lib/api_objects/mandata';
  import {base} from '$app/paths';
  import {goto} from '$app/navigation';
	import type { FCJScore } from '$lib/api_objects/fcjson';

  $: {if($activeManoeuvre=='') {goto(base + '/analysis')}}
  $: manid = $fcj?.unique_names.indexOf($activeManoeuvre!)!;

  
  const update_navitems = (scores:FCJScore|undefined, inter: Internals|undefined) => {
    
    navitems.update(v=>{
      let nitems=[];
      nitems.push(new NavContent('Summary', base + '/analysis/manoeuvre'));
      
      nitems.push(new NavContent('Alignment', base + '/analysis/manoeuvre/alignment'));
      if (inter?.scores && !$running[manid]) {
        nitems.push(new NavContent('Intra='+scores.intra.toFixed(2), base + '/analysis/manoeuvre/intra'));
        nitems.push(new NavContent('Inter='+scores.inter.toFixed(2), base + '/analysis/manoeuvre/inter'));
        nitems.push(new NavContent('Positioning='+scores.positioning.toFixed(2), base + '/analysis/manoeuvre/positioning'));
        nitems.push(new NavContent('Templates', base + '/analysis/manoeuvre/templates'));
      } 
      
    
      nitems.push(new NavContent('Back', base + '/analysis/'))
      return nitems;
    });
  }
  $: if ($internals) {update_navitems(
      $activeResult?.manresults[manid]?.get_score(3, false)?.score,
      $internals![manid]
    )};

</script>

{#if ($internals && $internals[manid]) && !$running.includes($activeManoeuvre || '')}
  <slot />
{:else}
  {#if $running.includes($activeManoeuvre || '')}
    <p>Running ...</p>
  {:else}
    <p>No Internal Data</p>
  {/if}
{/if}



<script lang='ts'>
   
  import { NavContent, navitems, selManID, analyses, running } from '$lib/stores';
  import {base} from '$app/paths';
	  	
  let man = analyses[$selManID];
  $: isRunning = running[$selManID]
  
  $: if ($man || !$isRunning) {
    navitems.update(v=>{
      let nitems=[
        new NavContent('Summary', base + '/analysis/manoeuvre'),
        new NavContent('Alignment', base + '/analysis/manoeuvre/alignment')
      ];
      
      if ($man?.scores) {
        nitems.push(new NavContent('Intra='+$man.scores.summary.intra.toFixed(2), base + '/analysis/manoeuvre/intra'));
        nitems.push(new NavContent('Inter='+$man.scores.summary.inter.toFixed(2), base + '/analysis/manoeuvre/inter'));
        nitems.push(new NavContent('Positioning='+$man.scores.summary.positioning.toFixed(2), base + '/analysis/manoeuvre/positioning'));
        nitems.push(new NavContent('Templates', base + '/analysis/manoeuvre/templates'));
      } 
      
      nitems.push(new NavContent('Back', base + '/analysis/'))
      return nitems;
    });

  };

</script>

{#if $man}
  {#if !$isRunning}
    <slot />
  {:else}
    <p>Running ...</p>
  {/if}
{:else}
  <p>No Internal Data</p>
{/if}


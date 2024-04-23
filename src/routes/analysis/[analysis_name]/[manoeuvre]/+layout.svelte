
<script lang='ts'>
   
  import { NavContent, flightdata, navitems } from '$lib/stores';
  import { AlignedMan, ScoredMan, BasicMan } from '$lib/api_objects/mandata';
  export let data;
  
  $: man = flightdata.mans[data.mname];
  
  const update_navitems = (man_: AlignedMan | ScoredMan | BasicMan) => {
    navitems.update(v=>{
      let nitems=[];
      nitems.push(new NavContent('Summary', 'summary'))
      if (!man_.busy) {
        if (man_ instanceof AlignedMan) {
          nitems.push(new NavContent('Alignment', 'alignment'));
          if (man_ instanceof ScoredMan) {
            nitems.push(new NavContent('Intra='+$man.scores.intra.total.toFixed(2), 'intra'));
            nitems.push(new NavContent('Inter='+$man.scores.inter.total.toFixed(2), 'inter'));
            nitems.push(new NavContent('Positioning='+$man.scores.positioning.total.toFixed(2), 'positioning'));
            nitems.push(new NavContent('Templates', 'templates'));
          } else {
            nitems.push(new NavContent('Score', '', ()=>flightdata.analyseManoeuvre(data.mname)));
          }
        } else {
          nitems.push(new NavContent('Align', '', ()=>flightdata.analyseManoeuvre(data.mname)));
        }
      } 
      nitems.push(new NavContent('Back', '/analysis/'+data.analysis_name))
      return nitems;
    });
  }
  
  $: update_navitems($man);

</script>

{#if !($man == null)}
  <slot />
{/if}


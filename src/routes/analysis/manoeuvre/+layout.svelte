
<script lang='ts'>
   
  import { NavContent, flightdata, navitems } from '$lib/stores';
  import { AlignedMan, ScoredMan, BasicMan } from '$lib/api_objects/mandata';
  import {base} from '$app/paths';
  export let data;
  
  $: man = flightdata.mans[data.mname];
  console.log(data.mname);
  const update_navitems = (man_: AlignedMan | ScoredMan | BasicMan) => {
    navitems.update(v=>{
      let nitems=[];
      nitems.push(new NavContent('Summary', base + '/analysis/manoeuvre?man='+data.mname));
      if (!man_.busy) {
        if (man_ instanceof AlignedMan) {
          nitems.push(new NavContent('Alignment', base + '/analysis/manoeuvre/alignment?man='+data.mname));
          if (man_ instanceof ScoredMan) {
            nitems.push(new NavContent('Intra='+$man.scores.intra.total.toFixed(2), base + '/analysis/manoeuvre/intra?man='+data.mname));
            nitems.push(new NavContent('Inter='+$man.scores.inter.total.toFixed(2), base + '/analysis/manoeuvre/inter?man='+data.mname));
            nitems.push(new NavContent('Positioning='+$man.scores.positioning.total.toFixed(2), base + '/analysis/manoeuvre/positioning?man='+data.mname));
            nitems.push(new NavContent('Templates', base + '/analysis/manoeuvre/templates?man='+data.mname));
          } else {
            nitems.push(new NavContent('Score', '', ()=>flightdata.analyseManoeuvre(data.mname)));
          }
        } else {
          nitems.push(new NavContent('Align', '', ()=>flightdata.analyseManoeuvre(data.mname)));
        }
      } 
      nitems.push(new NavContent('Back', base + '/analysis/'))
      return nitems;
    });
  }
  
  $: update_navitems($man);

</script>

{#if !($man == null)}
  <slot />
{/if}


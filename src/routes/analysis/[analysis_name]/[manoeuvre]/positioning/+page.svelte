
<script lang="ts">
	import { flightdata, colddraft } from '$lib/stores';
  import {split_states, States, type State} from '$lib/geometry';
  import type { Results, ManInfo } from "$lib/api_objects";
  import Plot from 'svelte-plotly.js';
  import {coloured_ribbons, points, boxtrace} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';

  export let data;

  $: man = flightdata.mans[data.mname];
  
  $: states = $man.aligned.split();

  const get_points = (states: Record<string, States>) => {
    return $man.mdef.info.centre_points.map(i=>{
      return Object.values(states)[i].data.at(-1).pos();
    })
  }

  const get_el_points = (states: Record<string, States>) => {
    return $man.mdef.info.centred_els.map(i=>{
      let el = Object.values(states)[i[0]+1].data;
      return el[Math.round(i[1] * el.length)].pos();
    })
  }

  $: centre_points = get_points(states);
  $: el_points = get_el_points(states);

</script>


<div id='parent'>
  <div id='table'>
    
    <div>Name</div>
    <div>Error</div>
    <div>Downgrade</div>
    
    {#each Object.values($man.score.positioning.data) as pos}
                      
          <div>{pos.name}</div>
          {#if pos.name=="distance"}
            <div>{pos.errors[0].toFixed(0)} m;</div>
          {:else}
            <div>{(pos.errors[0] * 180 / Math.PI).toFixed(2)} &deg</div>
          {/if}
          <div>{pos.total.toFixed(2)}</div>
        
    {/each}
  </div>
  <div>
    <Plot 
      data={
        coloured_ribbons(states,2)
        .concat(points(centre_points, $man.mdef.info.centre_points.map(i=>'centre point '.concat(i.toString())) )) 
        .concat(points(el_points, $man.mdef.info.centred_els.map(i=>'centred el '.concat(i[0].toString()))))
        .concat([boxtrace()])
      } 
      layout={layout3d}
      fillParent={true}
    />
  </div>
</div>


<style>
  #parent {display: grid; height:100%; width:100%; grid-template-columns: max-content 1fr;}
  #table {
    display: grid; 
    grid-template-columns: repeat(3, 1fr); 
    align-items: start; 
    align-self: start; 
  }


</style>
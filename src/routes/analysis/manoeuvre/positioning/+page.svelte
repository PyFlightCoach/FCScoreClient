
<script lang="ts">
	import { fcj, selManID, analyses} from '$lib/stores';
  import type { States} from '$lib/geometry';
  import Plot from 'svelte-plotly.js';
  import {coloured_ribbons, points, boxtrace} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';
	
  $: man = analyses[$selManID];
 
  $: states = $man.flown.split();

  const get_points = (states: Record<string, States>) => {
    return $man!.mdef.info.centre_points.map(i=>{
      return Object.values(states)[i-1].data.at(-1).pos();
    })
  }

  const get_el_points = (states: Record<string, States>) => {
    return $man!.mdef.info.centred_els.map(i=>{
      let el = Object.values(states)[i[0]].data;
      return el[Math.round(i[1] * el.length)].pos();
    })
  }

  $: centre_points = get_points(states);
  $: el_points = get_el_points(states);

</script>


<div id='parent'>
  <div id='table'>
    
    <div class='cell head'>Name</div>
    <div class='cell head'>Mean Error</div>
    <div class='cell head'>Mean Visibility</div>
    <div class='cell head'>Downgrade</div>
    
    {#each Object.values($man.scores.positioning.data) as pos}
                      
          <div class='cell'>{pos.name}</div>
          {#if pos.name=="distance"}
            <div class='cell'>{pos.errors.map(e=>e.toFixed(2))} m</div>
          {:else if ["side box", "top box"].includes(pos.name)}
            <div class='cell'>{pos.errors.map(e=>(e * 180 / Math.PI).toFixed(2))} &deg</div>
          {:else} 
            <div class='cell'>{(pos.errors[0] * 180 / Math.PI).toFixed(2)} &deg</div>
          {/if}
          <div class='cell'>{'visibility' in pos.measurement ? pos.measurement.visibility[0].toFixed(2) : 1}</div>
          <div class='cell'>{pos.total.toFixed(2)}</div>
        
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
  #parent {display: grid; height:100%; width:100%; grid-template-rows: max-content 1fr;}
  #table {
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    align-items: start; 
    align-self: start; 
  }
  .cell{text-align: center;}
  .cell.head{font-weight: bold;}

</style>
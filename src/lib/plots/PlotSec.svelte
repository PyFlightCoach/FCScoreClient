<script lang="ts">
	import type { States } from "$lib/geometry";
  import Plot from 'svelte-plotly.js';
  import {ribbon} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';
  import {colddraft } from '$lib/stores';
  import { ButtonGroup, Button } from 'flowbite-svelte';

  export let flst: States;
  export let tpst: States|null=null
  export let i: number|null=null;

  const createRibbonTrace = (st: States|null) => {
    if (st != null) {
      return ribbon(st, 3);
    } else {
      return {type: 'mesh3d', visible: false};
    }
  }

  let scale=1;
  let speed=50;
  let layout = layout3d;

  const createModelTrace = (st: States|null, i: number|null) => {
    if ((st != null) && i && (i<st.data.length)) {
      const fst = st.data[i];
      return $colddraft?.scale(scale).to_mesh3d(
        fst.pos(), fst.att(), {opacity: 1.0, hoverinfo: 'skip', name: 'fl model'}
      );
    } else {
      return {type: 'mesh3d', visible:false};
    }
  } 

  $: fl_ribbon=createRibbonTrace(flst);//, tp_ribbon, fl_model, tp_model;
  $: tp_ribbon=createRibbonTrace(tpst);
  $: fl_model = createModelTrace(flst, i);
  $: tp_model = createModelTrace(tpst, i);

  $: traces = [
    fl_ribbon,
    tp_ribbon,
    fl_model,
    tp_model,
  ];

  let player:NodeJS.Timeout;
  
  const play = () => {
    player=setInterval(
      ()=>{((i!=null) && (i<flst.data.length)) ? i++ : i=0;}, 
      speed
    );
  }

  const pause = () => {
    clearInterval(player); 
    player=undefined;
  }
</script>

<div style:height=100% id='parent'>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    style:height=100% 
    on:mousedown={()=>{clearInterval(player)}}
    on:mouseup={()=>{if (player) {play();}}}
  >
    {#if typeof traces !== 'undefined'}
    <Plot
      data={traces}
      layout={layout}
      fillParent={true}
      on:click={(e)=>{
        i=Math.floor(e.detail.points[0].pointNumber / 2);}
      }
      on:relayout={()=>console.log('relayout')}
      
    />
    {/if}
  </div>
  <div id='buttons'>
    <ButtonGroup>
      {#if player}
        <Button on:click={pause}>Pause</Button>
      {:else}
        <Button on:click={play}>Play</Button>
      {/if}
      <Button on:click={()=>{scale=Math.min(10, scale+1)}}>+</Button>
      <Button on:click={()=>{scale=Math.max(1, scale-1)}}>-</Button>
      <Button on:click={()=>{speed=Math.min(200, speed*1.6)}}>Slow</Button>
      <Button on:click={()=>{speed=Math.max(20, speed / 1.6)}}>Fast</Button>
      <Button on:click={()=>{
        layout.scene.camera.projection.type = (layout.scene.camera.projection.type=='perspective') ? 'orthographic': 'perspective';
        layout = layout;
        }}>{layout.scene.camera.projection.type}</Button>

    </ButtonGroup>
  </div>
</div>


<style>
  #parent {position: relative;}
  #buttons {position: absolute; bottom: 0;right: 0;}
</style>
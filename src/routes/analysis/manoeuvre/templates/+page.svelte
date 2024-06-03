<script lang='ts'>

  
    import Plot from 'svelte-plotly.js';
    import {modeltrace, ribbon} from '$lib/plots/traces';
    import {layout3d} from '$lib/plots/layouts';    
    import {Checkbox, BottomNav, BottomNavItem} from 'flowbite-svelte';
    import {flightdata} from '$lib/stores';
    import type {States} from '$lib/geometry';
    import colddraft from '$lib/plots/colddraft.js';
    export let data;
    let man = flightdata.mans[data.mname];
  
  
    const make_trace = (tp: States, models: boolean, name: string, color: string) => {
      const trs = [ribbon(tp, 3, {}, {name, color})]
  
      if (models) {
        trs.push(...modeltrace(tp.downsample(20), colddraft, {name, color}));
      }
      return trs;
    }
  
    const make_traces = (_man: Record<string, any>, bf: boolean, bi: boolean, bc: boolean) => {
      const trs = [];
      if (bf) {trs.push(...make_trace($man.flown, true, 'flown', 'red'))}
      if (bi) {trs.push(...make_trace($man.template, true, 'intended', 'blue'))}
      if (bc) {trs.push(...make_trace($man.corrected_template, true, 'corrected', 'green'))}
      return trs
    }
  
    let flown=true; let intended=true; let corrected=true;
  
    $: all_traces=make_traces($man, flown, intended, corrected);
    
    
  </script>

<div id='parent'>
  <div style:height=100%%>  
    <Plot 
      data={all_traces} 
      layout={layout3d} 
      fillParent={true} 
    />
  </div>
  <BottomNav classInner="grid-cols-5" >
    <BottomNavItem><Checkbox bind:checked={flown}>Flown</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={intended}>intended</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={corrected}>corrected</Checkbox></BottomNavItem>
  </BottomNav>
</div>
  

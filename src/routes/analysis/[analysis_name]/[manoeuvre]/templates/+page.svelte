<script lang='ts'>

  
  import Plot from 'svelte-plotly.js';
  import {modeltrace, ribbon} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';    
  import {Checkbox, BottomNav, BottomNavItem} from 'flowbite-svelte';
  import {flightdata, colddraft} from '$lib/stores';
  import {States} from '$lib/geometry';


  export let data;
  let man = flightdata.mans[data.mname];


  const make_trace = (tp: States, models: boolean, name: string, color: string) => {
    const trs = [ribbon(tp.data, 3, {}, {name, color})]

    if (models && ($colddraft != null)) {
      trs.push(...modeltrace(tp.downsample(20).data, $colddraft, {name, color}));
    }
    return trs;
  }

  const make_traces = (_man: Record<string, any>, bf: boolean, bi: boolean, bc: boolean) => {
    const trs = [];
    if (bf) {trs.push(...make_trace(new States($man.al), true, 'flown', 'red'))}
    if (bi) {trs.push(...make_trace(new States($man.intended_template), true, 'intended', 'blue'))}
    if (bc) {trs.push(...make_trace(new States($man.corrected_template), true, 'corrected', 'green'))}

//    if (bi) {trs.push(ribbon($man.intended_template, 3, {name:'intended', color:'blue', showlegend:true}))}
 //   if (bc) {trs.push(ribbon($man.corrected_template, 3, {name:'corrected', color:'green', showlegend:true}))}
    return trs
  }

  let fl=true; let intended=true; let corrected=true;

  $: all_traces=make_traces($man, fl, intended, corrected);
  
  
</script>


<div id='parent'>
  
  <Plot 
    data={all_traces} 
    layout={layout3d} 
    fillParent={true} 
  />
  <BottomNav classInner="grid-cols-5" >
    <BottomNavItem><Checkbox bind:checked={fl}>Flown</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={intended}>intended</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={corrected}>corrected</Checkbox></BottomNavItem>
  </BottomNav>
  
  
</div>


<style>
  #parent {height: 100%; width:100%; position:fixed}
</style>
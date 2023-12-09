<script lang='ts'>

  export let man: Record<string, any> = {};
  import Plot from 'svelte-plotly.js';
  import {coloured_ribbons, ribbon} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';    
  import {Checkbox, Tooltip, Input, BottomNav, BottomNavItem, Select} from 'flowbite-svelte';
  import Plotsec from '$lib/plots/Plotsec.svelte';
  import { colddraft } from '$lib/stores';
  import type {State} from '$lib/geometry';

  let all_traces:Record<string, any>={
    flown: ribbon(man.al, 3, {name:'flown', color:'red', showlegend:true}),
    intended: ribbon(man.intended_template, 3, {name:'intended', color:'blue', showlegend:true}),
    corrected: ribbon(man.corrected_template, 3, {name:'corrected', color:'green', showlegend:true})
  };
  
  let fl=true; let intended=true; let corrected=true;
  let traces = Object.values(all_traces).map(v=>v);
  
</script>


<div id='parent'>
  
  <Plot data={traces} layout={layout3d} fillParent={true} />
  <BottomNav classInner="grid-cols-5" >
    <BottomNavItem><Checkbox bind:checked={fl}>Flown</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={intended}>intended</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={corrected}>corrected</Checkbox></BottomNavItem>
  </BottomNav>
  
  
  

</div>


<style>
  #parent {height: 100%; position:fixed}


</style>
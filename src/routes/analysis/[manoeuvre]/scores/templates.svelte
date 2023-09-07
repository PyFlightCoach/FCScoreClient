<script lang='ts'>

  export let man: Record<string, any> = {};
  import Plotly from '$lib/plots/Plotly.svelte'; 
  import {coloured_ribbons, vectors} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';    
  import {Checkbox, Tooltip, Input, BottomNav, BottomNavItem, Select} from 'flowbite-svelte';

  let states:Record<string, any>={};
  let fl=true; let intended=true; let corrected=true;
  $: {
    states = {}
    if (fl) {states['flown'] = man.al };
    if (intended) {states['intended'] = man.intended_template };
    if (corrected) {states['corrected'] = man.corrected_template };
  }
  //
</script>


<div id='parent'>
  
  <Plotly data={coloured_ribbons(states, 5)} layout={layout3d}/>
  
  <BottomNav classInner="grid-cols-3" >
    <BottomNavItem><Checkbox bind:checked={fl}>Flown</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={intended}>intended</Checkbox></BottomNavItem>
    <BottomNavItem><Checkbox bind:checked={corrected}>corrected</Checkbox></BottomNavItem>
  </BottomNav>  
  
  

</div>


<style>
  #parent {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 800px max-content;
  }


</style>
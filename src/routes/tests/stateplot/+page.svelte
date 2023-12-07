
<script lang='ts'>
  import {State} from '$lib/geometry';
  
  import st_data from '$lib/data/template_state.json';
  import {OBJ} from '$lib/plots/traces';
  import Plotsec from '$lib/plots/Plotsec.svelte';
  import {Point, Quaternion} from '$lib/geometry';
  import {BottomNavItem} from 'flowbite-svelte';
  export let data;

  const obj = OBJ.parse(
    data.obj, 
    new Point(0.75, 0, 0), 
    new Quaternion(0, 0.70710678, -0.70710678, 0) ).scale(5);

  const state = State.parse_arr(st_data);

</script>

<div id="parent">
  
  <Plotsec state={state} obj={obj}>
    <BottomNavItem>Test</BottomNavItem>
  </Plotsec>

</div>



<style>
  #parent {height: 100%; position:fixed}
</style>
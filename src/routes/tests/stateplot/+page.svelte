
<script lang='ts'>
  import {State} from '$lib/geometry';
  
  import st_data from '$lib/data/template_state.json';
  
  import Plotsec from '$lib/plots/Plotsec.svelte';
  
  import {BottomNavItem} from 'flowbite-svelte';
	
  const state = State.parse_arr(st_data);

</script>

<div id="parent">
  
  <Plotsec state={state} >
    <BottomNavItem>Test</BottomNavItem>
  </Plotsec>
  
  
  
</div>



<style>
  #parent {height: 100%; position:fixed}
</style>
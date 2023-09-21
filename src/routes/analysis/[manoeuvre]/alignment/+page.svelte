

<script lang="ts">
import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
  $: man = flightdata.mans[$page.params['manoeuvre']];
  import Plotly from '$lib/plots/Plotly.svelte'; 
  import {coloured_ribbons} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';    
  
  import {split_states} from '$lib/geometry';
  
  $: states = split_states($man['al']);
</script>


<Plotly data={coloured_ribbons(states, 5)} layout={layout3d}/>


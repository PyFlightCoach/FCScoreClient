

<script lang="ts">
import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
  $: man = flightdata.man($page.params['manoeuvre']);
  import PlotState from '$lib/plots/plot3d.svelte';
  import {coloured_ribbons} from '$lib/plots/traces';
  import {split_states} from '$lib/geometry';
  
  $: states = split_states($man['al']);
</script>


<PlotState data={coloured_ribbons(states, 5)}/>


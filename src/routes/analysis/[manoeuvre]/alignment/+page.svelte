

<script lang="ts">
import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
  $: man = flightdata.man($page.params['manoeuvre']);
  import PlotState from '$lib/plots/plot3d.svelte';
  import {split_states} from '$lib/geometry';
  
  $: states = split_states($man['al']);
</script>


<PlotState states={states}/>


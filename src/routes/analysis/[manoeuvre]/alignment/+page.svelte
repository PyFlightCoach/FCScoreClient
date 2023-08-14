

<script lang="ts">

  import { flightdata } from '$lib/stores.js';
  import {page} from '$app/stores';
  import PlotState from '$lib/plots/plot3d.svelte';
  import {split_states, type State} from '$lib/geometry';


  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);
  
  $: states = split_states($man['al']);
</script>


<PlotState states={states}/>


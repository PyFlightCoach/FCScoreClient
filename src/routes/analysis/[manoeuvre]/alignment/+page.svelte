

<script lang="ts">

  import { flightdata } from '$lib/stores.js';
  import {page} from '$app/stores';
  import PlotState from '$lib/plotState.svelte';

  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);
    

</script>


<PlotState state={$man['al']}/>


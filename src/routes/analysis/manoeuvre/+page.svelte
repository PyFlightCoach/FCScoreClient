

<script lang='ts'>
  import {BasicMan, ScoredMan} from '$lib/api_objects/mandata';
  import { flightdata } from '$lib/stores';
  import PlotSec from '$lib/plots/PlotSec.svelte';
  
  export let data;
  $: man = flightdata.mans[data.mname];


</script>

<PlotSec
  flst={$man instanceof BasicMan ? $man.flown : $man.flown}
  tpst={$man instanceof ScoredMan ? $man.corrected_template : null}
  i={0}
/>

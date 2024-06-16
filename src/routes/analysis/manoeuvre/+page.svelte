

<script lang='ts'>
  
  import { flightdata, mname } from '$lib/stores';
  import PlotSec from '$lib/plots/PlotSec.svelte';
  

  let man = flightdata.mans[$mname];

  

</script>

<PlotSec flst={$man.internals.flown} i={1}/>

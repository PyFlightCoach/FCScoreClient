

<script lang='ts'>
  import {Man} from '$lib/api_objects/mandata';
  import { flightdata } from '$lib/stores';
  import PlotSec from '$lib/plots/PlotSec.svelte';
  
  export let data;
  $: man = flightdata.mans[data.mname];


</script>

{#if $man.internals===null}
  <p>No Internal Data</p>
  {:else}
<PlotSec
    flst={$man.internals.flown}
    i={0}
  />
{/if}
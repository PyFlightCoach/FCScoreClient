

<script lang='ts'>
  import {ReadMan} from '$lib/api_objects/mandata';
  import { flightdata, colddraft} from '$lib/stores';
  import {ribbon} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';

  import Plot from 'svelte-plotly.js';

  export let data;
  $: man = flightdata.mans[data.mname];
  $: mannames = flightdata.mannames;

  $: st = $man instanceof ReadMan ? $man.flown : $man.aligned;

</script>

<div style:height=100%>
  <div>
    {$man.mdef.info.name}, Status = {['Read', 'Aligned', 'Scored'][$mannames[data.mname]-1]}
  </div>
  <div style:height=100%>
    <Plot
      data={[ribbon(st, 3)]}
      layout={layout3d}
      fillParent={true}
    />
  </div>
</div>


<style>
  #parent {
    display: grid; grid-template-columns: min-content 1fr; align-items: stretch;
  }
</style>

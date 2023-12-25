

<script lang='ts'>
  import {ReadMan} from '$lib/api_objects/mandata';
  import { flightdata, colddraft} from '$lib/stores';
  import {ribbon} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';

  import Plot from 'svelte-plotly.js';

  export let data;
  $: man = flightdata.mans[data.mname];
  $: mannames = flightdata.mannames;

  $: st = $man instanceof ReadMan ? $man.fl : $man.al;

</script>

<div>
  <p>{$man.mdef.info.name}, Status = {['Read', 'Aligned', 'Scored'][$mannames[data.mname]-1]}</p>
  <Plot
    data={[ribbon(st, 3)]}
    layout={layout3d}
    fillParent={true}
  />
</div>

<style>
  div {height:94%}
</style>

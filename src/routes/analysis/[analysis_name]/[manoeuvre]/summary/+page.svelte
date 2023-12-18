

<script lang='ts'>
    import {page} from '$app/stores';
	import { flightdata, colddraft} from '$lib/stores';
    import {ribbon} from '$lib/plots/traces';
    import {layout3d} from '$lib/plots/layouts';

    import Plot from 'svelte-plotly.js';

    export let data;
    $: man = flightdata.mans[data.mname];
    $: mannames = flightdata.mannames;

    

</script>

<div>

  <p>{$man.mdef.info.name}, Status = {['Read', 'Aligned', 'Scored'][$mannames[data.mname]-1]}</p>
    
  
  {#if 'al' in $man}
    <Plot
      data={[ribbon($man.al, 3)]}
      layout={layout3d}
      fillParent={true}
    />
  
  {/if}
</div>

<style>
  div {height:100%}
</style>

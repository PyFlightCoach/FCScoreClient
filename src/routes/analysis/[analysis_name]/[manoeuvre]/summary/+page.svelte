

<script lang='ts'>
    import {page} from '$app/stores';
	import { flightdata, colddraft} from '$lib/stores';
    import {ribbon} from '$lib/plots/traces';
    import {layout3d} from '$lib/plots/layouts';

    import Plot from 'svelte-plotly.js';

    export let data;
    $: man = flightdata.mans[data.mname];

</script>

<p>{$man.mdef.info.name}</p>
<p>Add some summary info here</p>
{#if 'al' in $man}
  <Plot
    data={[ribbon($man.al, 3)]}
    layout={layout3d}
    fillParent={true}
  />
{/if}
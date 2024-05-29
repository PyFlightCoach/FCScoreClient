<script lang="ts">
  import { onMount } from 'svelte';
  import {get_telemetry} from '$lib/api_calls';
  import Plot from 'svelte-plotly.js';

  let processes = {};
  let data_in = {};
  let data_out = {};
  get_telemetry().then((res) => {
    processes = res.processes;
    data_in = res.data_in;
    data_out = res.data_out;
  });

  
</script>


<div id='parent'>
  <Plot
    data={[
        {
          type: 'scatter',
          x: processes.time,
          y: processes.processes,
          mode: 'lines',
          name: 'active processes'
        },
        {
          type: 'scatter',
          x: data_in.time,
          y: data_in.length,
          mode:'markers',
          name: 'data in',
          yaxis: 'y2'
        },
        {
          type: 'scatter',
          x: data_out.time,
          y: data_out.length,
          mode:'markers',
          name: 'data out',
          yaxis: 'y2'
        },
        {
          type: 'scatter',
          x: data_in.time,
          y: data_in.total,
          mode:'lines',
          name: 'total data in',
          yaxis: 'y3'
        },
        {
          type: 'scatter',
          x: data_out.time,
          y: data_out.total,
          mode:'lines',
          name: 'total data out',
          yaxis: 'y3'
        },
    ]}
    layout={{
      yaxis:{title:'processes', domain:[0, 0.3]},
      yaxis2:{title:'data (KB)', domain:[0.3, 0.7]},
      yaxis3:{title:'total data (KB)', domain:[0.7, 1.]},
    }}
    fillParent={true}
  />
</div>
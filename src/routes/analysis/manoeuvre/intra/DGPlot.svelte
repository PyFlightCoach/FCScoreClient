<script lang='ts'>
  import type {Result} from '$lib/api_objects/scores';
  import Plot from 'svelte-plotly.js';
  import { downgrade_info} from '$lib/plots/traces';
	import type { DownGrade } from '$lib/api_objects/mandef';
  export let result: Result;

  export let activeIndex: null|number = null;
  
  $: plotIndex = activeIndex == null ? 0 : activeIndex;

  
  $: scale= (result.measurement.unit == 'rad') ? 180/Math.PI : 1;
     
  $: unit = result.measurement.unit.replace('rad', 'deg');
  $: minrng = {deg: Math.PI/20, m: 20, ratio: 3}[unit] || 1;
  
  </script>

<Plot 
  data={downgrade_info(result, scale)}
  layout={{
    yaxis:{
      title:'measurement (' + unit + ')',
    },
    yaxis2:{
      title:'visibility',
      overlaying: 'y',
      side: 'right',
      range: [0, 1]
    },
    xaxis:{
      visible: false,
      range: [0, result.measurement.value.length],
      hovermode: "x unified",
    },
    legend:{orientation: 'h', x:0.2, y:0},
    autosize: true,
    margin: {l:60, r:70, t:0, b:0},
    shapes: [{
        type: 'line', 
        x0: plotIndex, 
        y0: 0, 
        x1: plotIndex, 
        y1: 1, 
        yref: 'paper',
        line: {color: 'black', width: 1},
      }],
    modebar: {orientation: 'v'}
  }}
  fillParent={true}
  on:click={(e) => {activeIndex=e.detail.points[0].x}}
  
/>
<script lang='ts'>
  import type {Result} from '$lib/api_objects/scores';
  import Plot from 'svelte-plotly.js';
  import { downgrade_info} from '$lib/plots/traces';
  export let result: Result;
  export let element: Record<string, any>;
  export let activeIndex: null|number = null;
  export let downgrade: Record<string, any>;

  $: plotIndex = activeIndex == null ? 0 : activeIndex;

  $: kind = downgrade?.criteria.kind || 'Single';  
  $: scale= (result.measurement.unit == 'rad') ? 180/Math.PI : 1;
     
  $: unit = result.measurement.unit == 'rad' ? 'deg': result.measurement.unit;
  $: minrng = {deg: Math.PI/20, m: 20, ratio: 3}[unit] || 1;
  $: range = Math.max(-Math.min(...result.sample), Math.max(...result.sample), minrng) * 2 * scale;
</script>

<Plot 
  data={downgrade_info(result, scale)}
  layout={{
    yaxis:{
      title:'measurement (' + unit + ')',
      range: [-range, range]
    },
    yaxis2:{
      title:'visibility',
      overlaying: 'y',
      side: 'right',
      range: [0, 1]
    },
    xaxis:{
      visible: false,
      range: [0, result.measurement.value.length]
    },
    legend:{orientation: 'h', x:0.2, y:0},
    autosize: true,
    margin: {l:30, r:30, t:0, b:0},
    shapes: [{
        type: 'line', 
        x0: plotIndex, 
        y0: 0, 
        x1: plotIndex, 
        y1: 1, 
        yref: 'paper',
        line: {color: 'black', width: 1},
      }]
  }}
  fillParent={true}
  on:hover={(e) => {activeIndex=e.detail.points[0].x}}
/>
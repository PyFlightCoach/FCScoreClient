<script lang='ts'>
  import type {Result} from '$lib/api_objects/scores';
  import Plot from 'svelte-plotly.js';
  import { downgrade_info} from '$lib/plots/traces';
  export let result: Result;
  export let element: Record<string, any>;
  export let activeIndex: null|number = null;

  $: plotIndex = activeIndex == null ? 0 : activeIndex;

  $: downgrade = element.scoring[result.name];
  $: kind = downgrade.criteria.kind

  let scale:number=1;
  $: {
    if ((kind == 'Single') ||  (kind == 'ContAbs')) {
      scale=180/Math.PI;
    } else {scale=1}
  }

  $: miny = Math.min(...result.sample, 0) * 2 * scale;
  $: maxy = Math.max(...result.sample, 0) * 2 * scale;

</script>

<Plot 
  data={downgrade_info(result, scale)}
  layout={{
    yaxis:{
      title:'measurement',
      range: [miny, maxy]
    },
    yaxis2:{
      title:'visibility',
      overlaying: 'y',
      side: 'right',
      range: [0, 1]
    },
    xaxis:{
      visible: false,
      range: [0, result.sample.length]
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
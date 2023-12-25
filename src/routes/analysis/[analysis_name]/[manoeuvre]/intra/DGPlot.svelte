<script lang='ts'>
	import type {Result} from '$lib/api_objects/scores';
    import Plot from 'svelte-plotly.js';
    import { downgrade_info} from '$lib/plots/traces';
    export let result: Result;
    export let element: Record<string, any>;

    $: downgrade = element.scoring[result.name];

    let scale:number=1;
    $: {
        if (downgrade.criteria.comparison=='absolute') {
            scale=180/Math.PI;
        } else {scale=1}
    }

</script>

<Plot 
  data={downgrade_info(result, scale)}
  layout={{
      yaxis:{
          title:'measurement',
          range: [
              Math.min(...result.sample, 0) * 2 * scale, 
              Math.max(...result.sample, 0) * 2 * scale
          ]
      },
      yaxis2:{
          title:'visibility',
          overlaying: 'y',
          side: 'right',
          range: [0, 1]
      },
      xaxis:{visible: false},
      legend:{orientation: 'h', x:0.2, y:0},
      autosize: true,
      margin: {l:30, r:30, t:0, b:0},
  }}
  fillParent={true}
/>
<script lang='ts'>
  import type {Result} from '$lib/api_objects';
  
  import Plot from 'svelte-plotly.js';
  import {criteria_info} from '$lib/plots/traces';
  
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
  data={[criteria_info(downgrade.criteria, scale)]} 
  layout={{
      yaxis:{title:'downgrade',range:[0,10]}, 
      xaxis:{title: downgrade.criteria.comparison + ' error'},
      autosize: true,
      margin: {l:30, r:0, t:0, b:30},
  }}
  fillParent={true}
/>



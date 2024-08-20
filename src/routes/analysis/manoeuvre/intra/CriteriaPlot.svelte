<script lang='ts'>
  import type {Result} from '$lib/api_objects/scores';
  
  import Plot from 'svelte-plotly.js';
  import {criteriaInfo} from '$lib/plots/traces';
  import type { DownGrade } from '$lib/api_objects/mandef';
  
  export let result: Result;
  export let downgrade: DownGrade;
  
  $: description = downgrade!.description(result);
</script>

<div id='parent'>
  <div>
    <Plot 
      data={criteriaInfo(downgrade.criteria, result)} 
      layout={{
          yaxis:{title:'downgrade'}, 
          xaxis:{title: downgrade.criteria.kind + ' error'},
          autosize: true,
          margin: {l:40, r:0, t:0, b:40},
      }}
      fillParent={true}
    />
  </div>
  <div>
    {description}
  </div>
</div>

<style>
  #parent {display: grid; grid-template-rows: 1fr min-content;}

</style>

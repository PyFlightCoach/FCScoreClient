<script lang='ts'>
  import type {Result} from '$lib/api_objects/scores';
  
  import Plot from 'svelte-plotly.js';
  import {criteriaInfo} from '$lib/plots/traces';
  
  export let result: Result;
  export let downgrade: Record<string, any>;

  $: b0 = (downgrade.criteria.kind == 'InsideBound' || downgrade.criteria.kind == 'OutsideBound') ? downgrade.criteria.bound[0] : null;
  $: b1 = (downgrade.criteria.kind == 'InsideBound' || downgrade.criteria.kind == 'OutsideBound') ? downgrade.criteria.bound[1] : null;
  $: b = (downgrade.criteria.kind == 'MaxBound' || downgrade.criteria.kind == 'MinBound') ? downgrade.criteria.bound : null;
  $: comment = {
      Single: 'This is a single criteria, only the end point of the element is assessed. The downgrade is based on absolute difference to the template.',
      ContRat: 'This is a continuous ratio criteria, all peaks and troughs in the sample are downgraded.',
      ContAbs: 'This is a continuous absoulute criteria, all increases in the sample away from zero are downgraded',
      MaxBound: 'This is a maximum bound criteria, all values above ' + b + ' are downgraded.',
      MinBound: 'This is a minimum bound criteria, all values below ' + b + ' are downgraded.',
      InsideBound: 'This is an inside bound criteria, all values below ' + b0 + ' or above ' + b1 + ' are downgraded.',
      OutsideBound: 'This is an outside bound criteria, all values between ' + b0 + ' and ' + b1 + ' are downgraded.',
    }[downgrade.criteria.kind];

</script>

<div id='parent'>
  <div>
    <Plot 
      data={[criteriaInfo(downgrade.criteria)]} 
      layout={{
          yaxis:{title:'downgrade',range:[0,10]}, 
          xaxis:{title: downgrade.criteria.kind + ' error'},
          autosize: true,
          margin: {l:30, r:0, t:0, b:30},
      }}
      fillParent={true}
    />
  </div>
  <div>
    {comment}
  </div>
</div>

<style>
  #parent {display: grid; grid-template-rows: 1fr min-content;}

</style>

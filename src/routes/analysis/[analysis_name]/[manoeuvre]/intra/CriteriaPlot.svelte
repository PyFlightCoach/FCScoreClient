<script lang='ts'>
  import type {Result} from '$lib/api_objects/scores';
  
  import Plot from 'svelte-plotly.js';
  import {criteriaInfo} from '$lib/plots/traces';
  
  export let result: Result;
  export let element: Record<string, any>;

  $: downgrade = element.scoring[result.name];

  let scale:number=1;
  $: {
      if (downgrade.criteria.kind=='ContAbs') {
          scale=180/Math.PI;
      } else {scale=1}
  }

</script>

<div id='parent'>
  <div>
    <Plot 
      data={[criteriaInfo(downgrade.criteria, scale)]} 
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
    {#if downgrade.criteria.kind == 'Single'}
      This is a single criteria, only the end point of the element is assessed. The downgrade is based on absolute difference to the template. 
    {:else if downgrade.criteria.kind == 'ContRat' }
      This is a continuous ratio criteria, all peaks and troughs in the sample are downgraded.
    {:else if downgrade.criteria.kind == 'ContAbs' }
      This is a continuous absoulute criteria, all increases in the sample away from zero are downgraded
    {:else if downgrade.criteria.kind == 'MaxBound' }
      This is a maximum bound criteria, all values above {downgrade.criteria.bound} are downgraded.
    {:else if downgrade.criteria.kind == 'MinBound' }
      This is a minimum bound criteria, all values below {downgrade.criteria.bound} are downgraded.
    {:else if downgrade.criteria.kind == 'InsideBound' }
      This is an inside bound criteria, all values below {downgrade.criteria.bound[0]} or above {downgrade.criteria.bound[1]} are downgraded.
    {:else if downgrade.criteria.kind == 'OutsideBound' }
      This is an outside bound criteria, all values between {downgrade.criteria.bound[0]} and {downgrade.criteria.bound[1]} are downgraded.
    {:else}
      This is an unknown criteria type.
    {/if}
  </div>
</div>

<style>
  #parent {display: grid; grid-template-rows: 1fr min-content;}

</style>

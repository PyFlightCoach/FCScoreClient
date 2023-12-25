<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import { Tooltip } from 'flowbite-svelte';

  export let difficulty = (v: number) => v;

  $: b = 1.3 - factor*0.1;
  $: m = 6 / 6**b;
  $: difficulty = (v: number) => m * v**b;

  let factor = 2;

  const xvals: number[] = [];
  for (let i = 0; i < 20; i++) {xvals.push(i/3);}


</script>


<div id='parent'>
  <p>Difficulty:</p>
  <input type="number" style:width=60px min="1" max="3" bind:value={factor}/>
  <Tooltip >Difficulty curve is applied to individual downgrades and weighted so that a six mark downgrade has a factor of 1 </Tooltip>
  <p>{['Easy', 'Medium', 'Hard'][factor-1]}</p>
  <div class='fullwidth'>
    <Plot
      data={[{
        x: xvals,
        y: xvals.map(difficulty),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
      }]}
      layout={{
        width:250,
        height:200,
        margin:{l:40, r:0, t:0, b:40},
        xaxis:{title:'Raw Downgrade', range:[0,2]},
        yaxis:{title:'Factored Downgrade', range:[0,2]}
      }}
      fillParent={true}
    />
  </div>
  
</div>

<style>
  #parent {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 250px;
    align-items: center;
  }
  .fullwidth {
    grid-column: 1 / 4;
    height: 200px;
    width: 100%;}
  p {
    font-size: medium;
    font-weight: bold;
    justify-self: start;
  }
</style>
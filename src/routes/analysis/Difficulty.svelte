<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import { Tooltip } from 'flowbite-svelte';

  export let modifier = (v: number) => v;

  const getDifficulty = (f: number) => {
    return ['Easy', 'Medium', 'Hard'][f-1]
  };
  const getFactor = (d: string) => {
    return ['Easy', 'Medium', 'Hard'].indexOf(d) + 1
  };

  let factor = getFactor(localStorage.getItem('difficulty') || 'Easy');
  
  $: localStorage.setItem('difficulty', getDifficulty(factor));
  

  $: b = 1.3 - factor*0.1;
  $: m = 6 / 6**b;
  $: modifier = (v: number) => m * v**b;


  const xvals: number[] = [];
  for (let i = 0; i < 20; i++) {xvals.push(i/3);}

</script>


<div id='parent'>
  <p>Difficulty:</p>
  <input type="number" style:width=60px min=1 max=3 bind:value={factor}/>
  <Tooltip >modifier curve is applied to individual downgrades and weighted so that a six mark downgrade has a factor of 1 </Tooltip>
  <p>{getDifficulty(factor)}</p>
  <div class='fullwidth'>
    <Plot
      data={[{
        x: xvals,
        y: xvals.map(modifier),
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
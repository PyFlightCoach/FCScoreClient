<script lang="ts">
  import { Button} from 'flowbite-svelte';
  import {flightdata} from '$lib/stores';
  
  let mannames = flightdata.mannames;

  $: summary = Object.keys($mannames).map(mn => {
    let row = {
        name:mn, 
        k:0, 
        aligned:$mannames[mn]>1, 
        scored: $mannames[mn]>2,
        score: 0,
        total: 0 
      };

    flightdata.man(mn).subscribe((man)=>{
      row.aligned = 'al' in man;
      row.scored = 'score' in man;
      row.k=man.mdef.info.k;
      if (row.scored) {
          row.score = man.score.score;
          row.total = row.score * row.k;
      }
    });

    return row;
  });

  $: nmans = Object.values($mannames).length;
  $: naligned = summary.filter((val) => val.aligned).length;
  $: nscored = summary.filter((val) => val.scored).length;
  $: total = summary.map((val) => val.total).reduce((a, b) => a + b, 0);


  const alignall = async () => {
    for (const mn of Object.keys($mannames)) {
      await flightdata.alignman(mn);
    }
  }

  const scoreall = async () => {
    for (const mn of Object.keys($mannames)) {
      await flightdata.alignman(mn);
      await flightdata.scoreman(mn);
    }
  }

</script>




<div id='parent'>
  <div id='head'>
    <div>move mouse to left or press spacebar to view manoeuvres</div>
    <div>manoeuvres = {nmans}</div>
    <div>aligned    = {naligned}</div>
    <div>scored     = {nscored}</div>
    <div>score      = {total.toFixed(1)}</div>
    <Button color="alternative" on:click={alignall}>Align All</Button>
    <Button color="alternative" on:click={scoreall}>Score All</Button>
  </div>

</div>




<style>
  div {
    text-align: center;
  }
  #parent {
    display:flex; flex-direction:column; align-items: stretch; 
  }
  #head {flex: 0 1 auto;}
</style>

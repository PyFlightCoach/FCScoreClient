<script lang="ts">
  import { Button} from 'flowbite-svelte';
  import {flightdata} from '$lib/stores';
  import {create_fc_json} from '$lib/api_calls';
  import {State} from '$lib/geometry';
  import type {ManDef} from '$lib/api_objects';
  import { saveAs } from 'file-saver';

  let mannames = flightdata.mannames;
  let direction = flightdata.direction;

  $: summary = Object.keys($mannames).map(mn => {
    let row = {
        name:mn, 
        k:0,
        entry: 1,
        aligned:$mannames[mn]>1, 
        scored: $mannames[mn]>2,
        score: 0,
        total: 0
      };
    
    flightdata.man(mn).subscribe((man)=>{
      row.aligned = 'al' in man;
      const st = ('al' in man) ? man.al[0] : man.fl[0]; 
      row.entry = State.parse(st).direction();
      row.scored = 'score' in man;
      row.k=man.mdef.info.k;
      if (row.scored) {
          row.score = man.score.score;
          row.total = row.score * row.k;
      }
    });

    return row;
  });
  
  $: entry = {0:'Right to Left', 1: 'Unknown', 2: 'Left to Right'}[$direction+1]
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

  const downloadTemplate = async (kind: string) => {
    if (nscored == nmans) {

      let sts: State[] = [];
      let mdefs: ManDef[] =[];
      Object.keys($mannames).forEach(mn => {
        flightdata.man(mn).subscribe(man=>{
          if (kind=='intended') {
            sts = sts.concat(man.intended_template);
          } else {
            sts = sts.concat(man.corrected_template);
          }
          
          mdefs.push(man.mdef);
        })();
      });
      let fcj = await create_fc_json(sts, mdefs, 'kind', 'F3A');
      var fileToSave = new Blob(
        [JSON.stringify(fcj)], 
        {type: 'application/json'}
      );

      saveAs(fileToSave, kind + '_template.json');
    }
  }

</script>




<div id='parent'>
  <div id='head'>
    <div>move mouse to left or press spacebar to view manoeuvres</div>
    <div>direction = {entry}</div>
    <div>manoeuvres = {nmans}</div>
    <div>aligned    = {naligned}</div>
    <div>scored     = {nscored}</div>
    <div>score      = {total.toFixed(1)}</div>
    <Button color="alternative" on:click={alignall}>Align All</Button>
    <Button color="alternative" on:click={scoreall}>Score All</Button>
    <Button color="alternative" on:click={() => downloadTemplate('intended')}>Download Intended Template FCjson</Button>
    <Button color="alternative" on:click={() => downloadTemplate('corrected')}>Download Corrected Template FCjson</Button>
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

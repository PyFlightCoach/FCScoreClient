<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import { flightdata, colddraft } from '$lib/stores';
  import {type ElementsResults, getEl} from '$lib/api_objects';
  import {States, Points, Point  } from '$lib/geometry';
  import {layout3d} from '$lib/plots/layouts';
  import {ribbon, modeltrace} from '$lib/plots/traces';
  import {d3Colors} from '$lib/plots/styling';
	import IntraPlot from './intra_plot.svelte';
  import CriteriaPlot from './CriteriaPlot.svelte';
  import DGPlot from './DGPlot.svelte';
	import ColouedTable from '$lib/ColouedTable.svelte';

  export let data;

  $: man = flightdata.mans[data.mname];
  $: summaries = $man.score.intra.summaries();

  $: state = new States($man.al);
  $: states = state.split();
  $: template = new States($man.intended_template);
  $: templates = template.split();
  
  let activeCriteria: null|string = null;
  let activeElName: null|string = null;

  let layout = layout3d;


  const dgtraces = (sts: Record<string, States>, tps: Record<string, States>, hel: string | null = null) => {
    
    const trs: Record<string, any>[] = [];
    for (let i = 0; i < Object.values(sts).length-1; i++) {
      const k = Object.keys(sts)[i];
      const st = Object.values(sts)[i];
      const tp = Object.values(tps)[i];
      const props = {color: d3Colors[i % d3Colors.length],name: k};

      if (k == hel) {
        trs.push(...modeltrace(st.downsample(3).data, $colddraft, {opacity: 1.0, ...props}));
        trs.push(...modeltrace(tp.downsample(3).data, $colddraft, {opacity: 0.5, ...props}));
        trs.push(ribbon(st.data, 2, {}, {opacity: 0.8, showlegend:false, ...props}));
        trs.push(ribbon(tp.data, 2, {}, {opacity: 0.4, showlegend:false, ...props}));

      } else if (hel == null) {
        trs.push(ribbon(st.data, 3, {}, {opacity: 0.8, showlegend:false, ...props}));
      } else {
        trs.push(ribbon(st.data, 2, {}, {opacity: 0.4, ...props}));
      } 
    }
    
    return trs;
  }

  $: traces = dgtraces(states, templates, activeElName);

  const update_layout = (st: States, sts: Record<string, States>, hel: string | null) => {
    if (hel == null) {
      return layout3d
    } else {
      const focusbb= new Points(sts[hel].pos()).range();
      const focuscentre =focusbb.mean();
      const focuslength = Point.distance(focusbb.data[0], focusbb.data[1]);

      const databb = new Points(st.pos()).range();
      const datacentre = databb.mean();
      const datalength = Point.distance(databb.data[0], databb.data[1]);
      
      const centre = Point.distance(datacentre, focuscentre).div(datalength);
      const framewidth = Math.max(focuslength.x, focuslength.z);
      const y = framewidth / datalength.y;
      
      const layout = {
        ...layout3d,
        scene:{...layout3d.scene,
          camera: {...layout3d.scene.camera,
            up: {x:0, y:0, z:1},
            center: centre,
            eye: {
              x: -0.6*(centre.x - 2*datacentre.x/datalength.x),//range.x,
              y: -0.6*75/datalength.y,//range.y-100,
              z: -(centre.z-1)*0.6//range.z,
      }}}}
      return layout;

    }
  }

  $: layout = update_layout(state, states, activeElName);
  $: showintra = activeElName != null && activeCriteria != null  && activeCriteria != 'Total';

</script>



<div id='container'>
  <ColouedTable data={summaries} bind:activeRow={activeElName} bind:activeCol={activeCriteria}/>  

  <div id='intra_summary'>
    <div class='plot' class:fullwidth={!showintra} class:fullheight={!showintra}> 
      <Plot layout={layout} data={traces} fillParent={true}
        on:click={(e) => {activeElName = e.detail.points[0].data.name;}}
      />
    </div>
    
    {#if showintra}  
      <div class='plot'>
        <CriteriaPlot
          result={$man.score.intra.data[activeElName].data[activeCriteria]}
          element={getEl(activeElName, $man.intended)}
        />
      </div>  
      <div class='plot fullwidth'><DGPlot 
        result={$man.score.intra.data[activeElName].data[activeCriteria]}
        element={getEl(activeElName, $man.intended)}          
      /></div>
        
      
      <!--IntraPlot 
        result={$man.score.intra.data[activeElName].data[activeCriteria]} 
        flown={states[activeElName]} 
        template={templates[activeElName]} 
        element={getEl(activeElName, $man.intended)}
      /-->
    {/if}
  </div>

</div>


<style>


  #container {height: 92%; width:100%; position:fixed; display:grid; grid-template-columns:1fr 2fr;  }
  .plot {height: 100%;  width: 100%;}
  .plot.fullwidth {grid-column: 1 / 3;}
  .plot.fullheight {grid-row: 1 / 3;}
  
  #intra_summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    height: 100%;
    width: 100%;
  }

</style>
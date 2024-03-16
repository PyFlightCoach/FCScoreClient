<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import { flightdata, colddraft } from '$lib/stores';
  import {ScoredMan} from '$lib/api_objects/mandata';
  import { goto } from '$app/navigation';
  import {States, Points, Point  } from '$lib/geometry';
  import {layout3d} from '$lib/plots/layouts';
  import {ribbon, modeltrace} from '$lib/plots/traces';
  import {d3Colors} from '$lib/plots/styling';
  import CriteriaPlot from './CriteriaPlot.svelte';
  import DGPlot from './DGPlot.svelte';
	import ColouedTable from '$lib/ColouedTable.svelte';
	import { log } from 'plotly.js-dist';
	

  export let data;


  $: man = flightdata.mans[data.mname];
  $: summaries = $man.score.intra.summaries();

  $: states = $man.aligned.split();
  $: templates = $man.template.split();
  
  let activeCriteria: null|string = null;
  let activeElName: null|string = null;
  let activeIndex: null|number = 0;
  let layout = layout3d;
  let cameracache: null|Object = null;
  let plot: null|Plot = null;

  $: element = $man.manoeuvre.getEl(activeElName);
  


  const dgtraces = (sts: Record<string, States>, tps: Record<string, States>, hel: string | null = null, hid: number=0) => {
    
    const trs: Record<string, any>[] = [];
    for (let i = 0; i < Object.values(sts).length-1; i++) {
      const k = Object.keys(sts)[i];
      const st = Object.values(sts)[i];
      const tp = Object.values(tps)[i];
      const props = {color: d3Colors[i % d3Colors.length]};
      const fst = st.data[0];
      const tst = tp.data[0];

      if (k == hel) {
        trs.push($colddraft.to_mesh3d(fst.pos(), fst.att(), {opacity: 1.0, hoverinfo: 'skip', name: 'fl model', ...props}));
        trs.push($colddraft.to_mesh3d(tst.pos(), tst.att(), {opacity: 0.5, hoverinfo: 'skip', name: 'tp model', ...props}))
        trs.push(ribbon(st, 2, {}, {opacity: 0.8, showlegend:false, name: k, ...props}));
        trs.push(ribbon(tp, 2, {}, {opacity: 0.4, showlegend:false, name: k, ...props}));

      } else if (hel == null) {
        trs.push(ribbon(st, 3, {}, {opacity: 0.8, showlegend:false, name: k, ...props}));
      } else {
        trs.push(ribbon(st, 2, {}, {opacity: 0.4, name: k, ...props}));
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
      
      cameracache = {...layout3d.scene.camera,
            up: {x:0, y:0, z:1},
            center: centre,
            eye: {
              x: -0.6*(centre.x - 2*datacentre.x/datalength.x),//range.x,
              y: -0.6*75/datalength.y,//range.y-100,
              z: -(centre.z-1)*0.6//range.z,
          }};

      return {
        ...layout3d,
        scene:{...layout3d.scene,
          camera: cameracache
      }}
    }
  }

  $: layout = update_layout($man.aligned, states, activeElName);
  $: showintra = activeElName != null && activeCriteria != null  && activeCriteria != 'Total';

  $: (() => {
    if (plot != null && activeElName != null && activeIndex != null) {
      
      //Plotly.update(plot, dgtraces(states, templates, activeElName, activeIndex));
      let activeId = 0;
      Object.keys(states).forEach((k,i)=>{if (k == activeElName) {activeId = i}});
      
      const k = Object.keys(states)[activeId];
      const st: States = Object.values(states)[activeId];
      const tp: States = Object.values(templates)[activeId];
      const props = {color: d3Colors[activeId % d3Colors.length]};
      activeIndex > st.data.length ? activeIndex = 0 : activeIndex;
      const fst = st.data[activeIndex];
      const tst = tp.data[activeIndex];

      traces.forEach((t, i) => {
        if (t.name.includes('fl model')) {
          traces[i] = $colddraft.to_mesh3d(fst.pos(), fst.att(), {opacity: 1.0, hoverinfo: 'skip', name: 'fl model', ...props});
        }  
        if (t.name.includes('tp model')) {
          traces[i] = $colddraft.to_mesh3d(tst.pos(), tst.att(), {opacity: 0.5, hoverinfo: 'skip', name: 'tp model', ...props});
        }  

      });
      
    }
    

  }) ();


</script>



<div id='container'>
  <ColouedTable data={summaries} bind:activeRow={activeElName} bind:activeCol={activeCriteria}/>  

  <div id='intra_summary'>
    <div class='plot' class:fullwidth={!showintra} class:fullheight={!showintra}> 
      <Plot bind:this={plot} layout={layout} data={traces} fillParent={true}
        on:click={(e) => {
          activeCriteria = null;
          activeElName = e.detail.points[0].data.name;
        }}
        on:hover={(e) => {
          if (activeElName == e.detail.points[0].data.name) {
             activeIndex = Math.floor(e.detail.points[0].pointNumber / 2);
          }
        }}
        on:relayout={(e) => {
          if ('scene.camera' in e.detail) {
            console.log('relayout');
            cameracache = {...cameracache, ...e.detail['scene.camera']};
          }
        }}
        on:afterPlot={(e) => {
          console.log('update');
          if (cameracache != null) {
            layout.scene.camera = cameracache;
          }
        }}
      />
    </div>
    
    {#if showintra}  
      <div class='plot split'>
        <div>
          {#if activeElName == 'entry_line'}
            <p>The entry line is assessed for roll angle and track only.</p>
          {:else}
            <p>{activeCriteria} downgrade for {element.kind} element {activeElName}</p>
            {#if Object.keys(element).indexOf('length') >=0}<p>length = {element.length.toFixed(0)} m</p>{/if}
            {#if Object.keys(element).indexOf('radius') >=0}<p>radius = {element.radius.toFixed(0)} m</p>{/if}
            {#if Object.keys(element).indexOf('roll') >=0}<p>roll = {(element.roll * 180 / Math.PI).toFixed(0)} degrees</p>{/if}
            {#if Object.keys(element).indexOf('angle') >=0}<p>angle = {(element.angle * 180 / Math.PI).toFixed(0)} degrees</p>{/if}
          {/if}          
          <p>downgrade = {$man.score.intra.data[activeElName].data[activeCriteria].total.toFixed(2)}</p>
          <p>{activeIndex}</p>  
        </div>
        
        <CriteriaPlot
          result={$man.score.intra.data[activeElName].data[activeCriteria]}
          element={$man.manoeuvre.getEl(activeElName)}
        />
        
      </div>  
      <div class='plot fullwidth'><DGPlot 
        result={$man.score.intra.data[activeElName].data[activeCriteria]}
        element={$man.manoeuvre.getEl(activeElName)}  
        bind:activeIndex={activeIndex}        
      /></div>

    {/if}
  </div>

</div>


<style>
  #container {display:grid; grid-template-columns:1fr 2fr;  }
  .plot {height: 100%;  width: 100%;}
  .plot.fullwidth {grid-column: 1 / 3;}
  .plot.fullheight {grid-row: 1 / 3;}
  
  .plot.split {display: grid; grid-template-rows: min-content 1fr;}

  #intra_summary {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 1fr 1fr;
  }

</style>
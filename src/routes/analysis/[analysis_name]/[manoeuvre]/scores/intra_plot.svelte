<script lang='ts'>
	import type {Result} from '$lib/api_objects';
    import type {State,  Point} from '$lib/geometry';
    import Plot from 'svelte-plotly.js';
    import {coloured_ribbons, criteria_info, single_point, downgrade_info} from '$lib/plots/traces';
    import {layout3d} from '$lib/plots/layouts';    
	import { error } from '@sveltejs/kit';
    export let result: Result;
    export let flown: State[];
    export let template: State[];
    export let element: Record<string, any>;

    let vec:Point[]; let pos: Point[];
    $: {
        vec=[]; pos=[];
        for (let i = 0; i < flown.length; i++) {
            vec[i] = result.measurement.value[i];
            pos[i] = flown[i].pos();
        }
    };


    $: traces_3d = coloured_ribbons({flown, template},2);//.concat(single_point());

    $: downgrade = element.scoring[result.name];

    let scale:number=1;
    $: {
        if (downgrade.criteria.comparison=='absolute') {
            scale=180/Math.PI;
        } else {scale=1}
    }

</script>


<div id='parent'>
    <div id='info'>
        {result.name} downgrades for {element.uid}<br />
        Total:      {result.total.toFixed(2)}<br/>
        Comparison: {downgrade.criteria.comparison}<br/>
        Criteria:   {downgrade.criteria.kind}<br/>
    </div>

    <div id='plotone'><Plot data={traces_3d} layout={layout3d} fillParent={true}/></div>

    <div id='plottwo'><Plot 
        data={[criteria_info(downgrade.criteria, scale)]} 
        layout={{
            yaxis:{title:'downgrade',range:[0,10]}, 
            xaxis:{title: downgrade.criteria.comparison + ' error'},
            autosize: true,
            margin: {l:30, r:0, t:0, b:30},
        }}
        fillParent={true}
    /></div>

    <div id='plotthree'><Plot 
        data={downgrade_info(result, scale)}
        layout={{
            yaxis:{
                title:'measurement',
                range: [
                    Math.min(...result.measurement.value, 0) * 1.5 * scale, 
                    Math.max(...result.measurement.value, 0) * 1.5 * scale
                ]
            },
            yaxis2:{
                title:'visibility',
                overlaying: 'y',
                side: 'right',
                range: [0, 1]
            },
            xaxis:{visible: false},
            legend:{orientation: 'h', x:0.2, y:0},
            autosize: true,
            margin: {l:30, r:30, t:0, b:0},
        }}
        fillParent={true}
    /></div>

</div>


<style>
#parent {
  display: grid;
  grid-template-columns: max-content 2fr 1fr;
  grid-template-rows: 400px 500px;
}
#info{
  grid-column: 1;
  grid-row: 1;  
}
#plotone {
  grid-column: 2;
  grid-row: 1;
}
#plottwo {
  grid-column: 3;
  grid-row: 1;
}
#plotthree {
  grid-column: 1/4;
  grid-row: 2;
}

</style>
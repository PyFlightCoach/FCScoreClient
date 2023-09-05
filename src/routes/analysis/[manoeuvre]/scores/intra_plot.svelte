<script lang='ts'>
	import type {Result} from '$lib/api_objects';
    import type {State,  Point} from '$lib/geometry';
    import Plotly from '$lib/plots/Plotly.svelte'; 
    import {coloured_ribbons, vectors, single_point} from '$lib/plots/traces';
    import {layout3d} from '$lib/plots/layouts';    
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
    let info: string[];
    $: {
        info = [];
        for (let i = 0; i < result.keys.length; i++) {
            info.push(
                'error = ' + result.errors[i].toFixed(2).toString() + 
                '<br>visibility = ' + result.measurement.visibility[result.keys[i]].toFixed(2).toString() +
                '<br>downgrade = ' + result.dgs[i].toFixed(2).toString() 
            )
        }
    }

    $: traces = coloured_ribbons({flown, template},2).concat(single_point());





</script>


<div>{result.name} downgrades for {flown[0].element}, total={result.total.toFixed(2)}</div>

{#each Object.entries(element) as entry}
    <div>{entry[0]}={entry[1]}</div>
{/each}
<Plotly data={traces} layout={layout3d}/>

<Plotly 
    data={[
        {
            type: 'scatter',
            y: result.measurement.value.map(p=>p.length()),
            name: 'measurement',
            hoverinfo:'skip',
            yaxis: 'y'
        },
        {
            type: 'scatter',
            y: result.sample,
            name: 'sample',
            line: {width: 3},
            hoverinfo:'skip',
            yaxis: 'y'
        },
        {
            type: 'scatter',
            x: result.keys,
            y: result.keys.map(k=>result.sample[k]),
            text: result.dgs.map(dg=>dg.toFixed(3)),
            hovertext: info,
            name: 'downgrades',
            mode: 'markers+text',
            marker: {size:12},
            textposition:"bottom center",
            yaxis: 'y'
        },
        {
            type: 'scatter',
            y: result.measurement.expected.map(p=>p.length()),
            line: {color: 'black', width: 1, dash: 'dash'},
            name: 'expected',
            hoverinfo:'skip',
            yaxis: 'y'
        },
        {
            type: 'scatter',
            y: result.measurement.visibility,
            name: 'visibility',
            hoverinfo:'skip',
            yaxis: 'y2'
        }
    ]}
    layout={{
        yaxis:{title:'measurement'},
        yaxis2:{
            title:'visibility',
            overlaying: 'y',
            side: 'right',
            range: [0, 1]
        },
        legend:{orientation: 'h', x:0.1, y:0.15}
    }}

/>

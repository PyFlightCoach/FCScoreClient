<script lang='ts'>
	import type {Result} from '$lib/api_objects';
    import type {State,  Point} from '$lib/geometry';
    import Plotly from '$lib/plots/Plotly.svelte'; 
    import {coloured_ribbons, vectors} from '$lib/plots/traces';
    import {layout3d} from '$lib/plots/layouts';    
    export let result: Result;
    export let flown: State[];
    export let template: State[];

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
        for (let i = 0; i < result.measurement.visibility.length; i++) {
            info.push(
                'value = ' + result.measurement.value[i].length().toFixed(2).toString() + 
                ', expected = ' + result.measurement.expected[i].length().toFixed(2).toString() +
                ', visibility = ' + result.measurement.visibility[i].toFixed(2).toString() 
            )
        }
    }

    $: vecs = vectors(pos, vec, info)
    
    $: traces = coloured_ribbons({flown, template},2);//.concat(vecs);

</script>


<div>{result.name} downgrades for {flown[0].element}, value={result.value}</div>
<Plotly data={traces} layout={layout3d}/>

<Plotly data={[
    {
        type: 'scatter',
        y: result.measurement.value.map(p=>p.length()),
        name: 'measurement'
    },
    {
        type: 'scatter',
        y: result.measurement.expected.map(p=>p.length()),
        name: 'expected'
    },
    {
        type: 'scatter',
        y: result.measurement.visibility,
        name: 'visibility'
    }
]}/>

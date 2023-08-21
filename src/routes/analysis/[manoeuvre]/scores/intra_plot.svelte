<script lang='ts'>
	import type {Result} from '$lib/api_objects';
    import type {State,  Point} from '$lib/geometry';
    import PlotState from '$lib/plots/plot3d.svelte';
    import {coloured_ribbons, vectors} from '$lib/plots/traces';
    
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
                'error = ' + result.measurement.value[i].length().toFixed(2).toString() + 
                ', visibility = ' + result.measurement.visibility[i].toFixed(2).toString() +
                ', expected = ' + result.measurement.expected[i].length().toFixed(2).toString()
            )
        }
    }

    $: vecs = vectors(pos, vec, info)
    
    $: traces = coloured_ribbons({flown, template},2).concat(vecs);

</script>


<div>{result.name} downgrades for {flown[0].element}, value={result.value}</div>
<PlotState data={traces}/>

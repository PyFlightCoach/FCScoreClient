<script lang='ts'>
	import type {Result} from '$lib/api_objects';
    import {type State, Point} from '$lib/geometry';
    import PlotState from '$lib/plots/plot3d.svelte';
    import {coloured_ribbons, vectors} from '$lib/plots/traces';
    
    export let result: Result;
    export let flown: State[];
    export let template: State[];

    let vec:Point[]; let pos: Point[];
    $: {
        vec=[]; pos=[];
        for (let i = 0; i < flown.length; i++) {
            vec[i] = new Point(
                result.measurement.value.x[i],
                result.measurement.value.y[i],
                result.measurement.value.z[i]
            );
            pos[i] = flown[i].pos;
        }
    };

</script>


<div>{result.name} downgrades for {flown[0].element}, value={result.value}</div>
<PlotState data={coloured_ribbons({flown, template}, 2.0).concat(
        vectors(pos, vec)
    )    
}/>

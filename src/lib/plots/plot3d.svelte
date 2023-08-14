

<script lang="ts">
    import Plotly from './Plotly.svelte';
    import type {State} from '$lib/geometry';
    export let states: Record<string, State[]> = {};
    export const id='dtwplot';
    export let span: number = 5;
    import {createRibbon, coloured_ribbons} from './traces';
    
    $: plotdata = coloured_ribbons(states, span);

    let layout = {
        legend: {font: {size: 20}, yanchor: "top", y: 0.99, xanchor: "left", x: 0.01},
        autosize: true,
        margin: {l:0, r:0, t:0, b:0},
        scene: {
            aspectmode:'data',
            camera: {
                up: {x:0, y:0, z:1},
                center: {x:0, y:0, z:-0.2},
                eye: {x:0.0, y:-3, z:-0.8},
                projection:{type:'perspective'}
            }
        }
    };

</script>


<Plotly
    {id}
    data={plotdata}
    layout={layout}
/>

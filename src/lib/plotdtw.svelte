

<script lang="ts">
    import Plotly from '../lib/Plotly.svelte';
    export const data = {}
    export const id='dtwplot';
</script>





<Plotly
    {id}
    data={[{ x: [0, 1, 2], y: [0, 1, 2], z: [0, 1, 2], type: 'scatter3d', mode: 'lines' }]}
    layout={[{
        scene: {aspectmode:'data'},
        legend: {
            font: {size: 20},
            yanchor: "top",
            y: 0.99,
            xanchor: "left",
            x: 0.01
        },
        autosize: true,
        margin: {l:0, r:0, t:0, b:0},
        scene_camera: {
            up: {x:0, y:0, z:1},
            center: {x:0, y:0, z:-0.2},
            eye: {x:0.0, y:-3, z:-0.8},
            projection:{type:'perspective'}
        }
    }]}
    on:click={(e) => console.log(e)}
    on:selected={(e) => console.log(e)}
    on:relayout={(e) => console.log('relayout', e)}

/>

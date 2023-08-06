

<script lang="ts">
    import Plotly from './Plotly.svelte';
    export let state: Record<string, any>[] = [];
    export const id='dtwplot';
    export let span: number = 5;

    import {State, Point, Quaternion} from '$lib/geometry';
	import { stringify } from 'postcss';

    const createRibbon = (st: Record<string, any>[], sp: number) => {
        const semisp = sp / 2;

        let points: Point[] = [];

        st.forEach((val) => {
            const _s = new State(val);
            points.push(_s.body_to_world(new Point(0, semisp, 0)));
            points.push(_s.body_to_world(new Point(0, -semisp, 0)));
        });

        let _i: number[] = []; let _j: number[] = []; let _k: number[] = [];
        
        for (let i = 0; i < points.length-2; i+=2) {
            _i.push(i  ); _j.push(i+1); _k.push(i+2);
            _i.push(i+1); _j.push(i+3); _k.push(i+2);
        }
        
        //const facecolor: string[] = points.slice(0,-2).map(() => 'red');

        let data: Record<string, number[]>={x: [], y: [], z: []};
        points.forEach((val: Record<string, any>) => {
            data.x.push(val.x); data.y.push(val.y); data.z.push(val.z);
        })

        //intensitymode:"cell", facecolor
//        return {...data, type: "scatter3d", mode: 'lines'};
        return {...data, i:_i, j:_j, k:_k, type: 'mesh3d'};
    };

    const colouredRibbons = (st: Record<string, any>[], sp: number) => {

        let groups: Record<string, Record<string, any>[]> = {};
        st.forEach((val) => {
            if (val.element in groups) {
                groups[val.element].push(val);
            } else {
                groups[val.element] = [val];
            }
        });
        
        return Object.keys(groups).map(
            (el) => {return {...createRibbon(groups[el], sp), name: el}}
        );

    }

    $: plotdata = colouredRibbons(state, span);


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

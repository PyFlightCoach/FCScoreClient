

<script lang="ts">
    import Plotly from './Plotly.svelte';
    export let state: Record<string, any>[] = [];
    export const id='dtwplot';
    export let span: number = 5;

    import {State, Point, Quaternion, zip} from '$lib/geometry';

    const parseState = (st: Record<string, any>[], sp: number) => {

//        triids = np.array(range(len(points) - 2))
//        _i = triids   # 1 2 3 4 5
//
//        _js = np.array(range(1, len(points), 2))
//        _j = _npinterzip(_js, _js)[1:-1] # 1 3 3 4 4 5 
//
//        _ks = np.array(range(2, len(points) -1 , 2))
//        _k = _npinterzip(_ks, _ks) # 2 2 4 4 6 6 
//
//
//        return [go.Mesh3d(
//            x=points.x, y=points.y, z=points.z, i=_i, j=_j, k=_k,
//            intensitymode="cell",
//            facecolor=np.full(len(triids), color),
//            name=name,
//        )]

        console.log(sp);
        const points: Point[] = zip(
            st.map((val) => new State(val).body_to_world(new Point(0, sp/2, 0))),
            st.map((val) => new State(val).body_to_world(new Point(0, -sp/2, 0)))
        );
        let _i: number[] = []; let _j: number[] = []; let _k: number[] = [];
        let facecolor: string[] = [];
        for (let i = 0; i < points.length-2; i+=2) {
            _i.push(i);
            _j.push(i+1);
            _k.push(i+2);

            _i.push(i+1);
            _j.push(i+3);
            _k.push(i+2);
        }

        points.forEach(() => {facecolor.push('red');});

        let data: Record<string, number[]>={x: [], y: [], z: []};
        points.forEach((val: Record<string, any>) => {
            data.x.push(val.x); data.y.push(val.y); data.z.push(val.z);
        })


        return {...data, i:_i, j:_j, k:_j,intensitymode:"cell", type: 'mesh3d', facecolor: facecolor};
    };


    $: plotdata = parseState(state, span);


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
    data={[plotdata]}
    layout={layout}
/>

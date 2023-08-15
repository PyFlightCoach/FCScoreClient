
import {State, Point, Quaternion} from '$lib/geometry';


export const ribbon = (st: State[], sp: number) => {
    const semisp = sp / 2;

    let points: Point[] = [];

    st.forEach((_s: State) => {
        points.push(_s.body_to_world(new Point(0, semisp, 0)));
        points.push(_s.body_to_world(new Point(0, -semisp, 0)));
    });

    let _i: number[] = []; let _j: number[] = []; let _k: number[] = [];
    for (let i = 0; i < points.length-2; i+=2) {
        _i.push(i  ); _j.push(i+1); _k.push(i+2);
        _i.push(i+1); _j.push(i+3); _k.push(i+2);
    }
    
    let data: Record<string, number[]>={x: [], y: [], z: []};
    points.forEach((val: Record<string, any>) => {
        data.x.push(val.x); data.y.push(val.y); data.z.push(val.z);
    })

    return {...data, i:_i, j:_j, k:_k, type: 'mesh3d'};
};


export const coloured_ribbons = (states: Record<string, State[]>, span: number) => {
    return Object.keys(states).map(
        (el) => {return {...ribbon(states[el], span), name: el}}
    );  
}

export const vectors = (pos: Point[], vec: Point[]) => {
    /*def vectors(npoints: int, seq: State, vectors: Point, **kwargs):
    trs = []
    step = int(len(seq.data) / (npoints+1))
    for pos, wind in zip(seq.pos[::step], vectors[::step]):
        pdata = Point.concatenate([pos, pos+wind])
        trs.append(trace3d(*pdata.data.T, **kwargs))    
    return trs*/
    let trs: Record<string, any>[] = [];
    for (let i = 0; i < pos.length; i++) {
        trs.push({
            type:'scatter3d',
            x:[pos[i].x, pos[i].x + vec[i].x],
            y:[pos[i].y, pos[i].y + vec[i].y],
            z:[pos[i].z, pos[i].z + vec[i].z]
        });
    }

    return trs;
}


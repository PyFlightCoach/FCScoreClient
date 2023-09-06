
import {State, Point, Quaternion} from '$lib/geometry';
import {linspace} from '$lib/arrays';

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

export const vectors = (pos: Point[], vec: Point[], text: string[] | null = null): Record<string, any>[] => {
    let trs: Record<string, any>[] = [];
    for (let i = 0; i < pos.length; i++) {
        trs.push({
            type:'scatter3d',
            x:[pos[i].x, pos[i].x + vec[i].x],
            y:[pos[i].y, pos[i].y + vec[i].y],
            z:[pos[i].z, pos[i].z + vec[i].z],
            mode:'lines',
            line: {color: 'black', width: 2},
            showlegend: false,
            text: (text==null)?'':text[i]
        });
    }

    return trs;
}


export const single_point = (x=0, y=0, z=0) => {
    return {
        type:'scatter3d',
        x:[x],
        y:[y],
        z:[z],
        mode:'markers',
        name:'pilot position',
        showlegend: false
    }
}


export const downgrade_info = (result: Record<string, any>, scale=1.0) => {
    let info: string[] = [];
    for (let i = 0; i < result.keys.length; i++) {
        info.push(
            'error = ' + (result.errors[i]*scale).toFixed(1).toString() + 
            '<br>visibility = ' + result.measurement.visibility[result.keys[i]].toFixed(2).toString() +
            '<br>downgrade = ' + result.dgs[i].toFixed(2).toString() 
        )
    }

    return [
        {
            type: 'scatter',
            y: result.measurement.value.map(p=>p.length()*scale),
            name: 'measurement',
            line: {color: 'black', width: 1},
            hoverinfo:'skip',
            yaxis: 'y'
        },
        {
            type: 'scatter',
            y: result.sample.map(p=>{
                if(p!=null) {
                    return p*scale;
                } else {
                    return null;
                }}
            ),
            name: 'sample',
            line: {width: 3},
            hoverinfo:'skip',
            yaxis: 'y'
        },
        {
            type: 'scatter',
            x: result.keys,
            y: result.keys.map(k=>result.sample[k]*scale),
            text: result.dgs.map(dg=>dg.toFixed(3)),
            hovertext: info,
            name: 'downgrades',
            mode: 'markers+text',
            marker: {size:12, color:'red'},
            textposition:"bottom center",
            yaxis: 'y'
        },
        {
            type: 'scatter',
            y: result.measurement.expected.map(p=>p.length()*scale),
            line: {color: 'black', width: 1, dash: 'dash'},
            name: 'expected',
            hoverinfo:'skip',
            yaxis: 'y'
        },
        {
            type: 'scatter',
            y: result.measurement.visibility,
            name: 'visibility',
            line: {color:'blue', width:1, dash:'dot'},
            hoverinfo:'skip',
            yaxis: 'y2'
        }
    ]
}



export const criteria_info = (criteria: Record<string, any>, scale: number) => {
    
    const x = criteria.comparison=='absolute' ?  linspace(0.0, 90.0, 20.0) : linspace(0.0,5.0,20.0);
    
    const y = x.map(v=>criteria.lookup.factor*Math.pow((v/scale), criteria.lookup.exponent))

    return {type: 'scatter',x, y, line: {color: 'black'}}

}
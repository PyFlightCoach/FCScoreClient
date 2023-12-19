import {Point, sum} from '$lib/geometry';


export function parse_dict(data: Record<string, any>, parser) {
    let outdata: Record<string, any> = {};
    Object.entries(data).forEach(entry => {outdata[entry[0]] = parser(entry[1]);});
    return outdata;
}


export const Heights = ["BTM","MID","TOP"] as const;
export const Directions = ["DRIVEN","UPWIND","DOWNWIND"] as const;
export const Orientations = ["DRIVEN","UPRIGHT","INVERTED"] as const;
export const Positions = ["CENTRE","END"] as const;
export type Height = typeof Heights[number];
export type Direction = typeof Directions[number];
export type Orientation = typeof Orientations[number];
export type Position = typeof Positions[number];


export class BoxLocation{
    constructor(readonly h: Height, readonly d: Direction, readonly  o: Orientation) {}
    static parse(data: BoxLocation) {return new BoxLocation(data.h, data.d, data.o);}
} 

export class ManInfo{
    constructor (
        readonly name: string, readonly short_name: string, 
        readonly k: number, readonly position: Position, 
        readonly start: BoxLocation, readonly end: BoxLocation, 
        readonly centre_points: number[], readonly centred_els: number[][]) {}

    static parse(data: ManInfo) {return new ManInfo(
        data.name, data.short_name, data.k, data.position, BoxLocation.parse(data.start),
        BoxLocation.parse(data.end), data.centre_points, data.centred_els
    )}

    static default() {return new ManInfo(
        'new manoeuvre', 'man', 0, "CENTRE",
        new BoxLocation("BTM", "UPWIND", "UPRIGHT"),
        new BoxLocation("BTM", "DRIVEN", "DRIVEN"),
        [],[]
    )}
}





export class ManParm{
    constructor (readonly name: string, readonly criteria: Record<string, any>, 
        readonly defaul: any, readonly collectors: Record<string, any>) {}
    static parse(data: Record<string, any>) {return new ManParm(
        data.name, data.criteria, data.default, data.collectors
    )}

}

export class ManDef{
    constructor (readonly info: ManInfo, readonly mps: Record<string, ManParm>, readonly eds: Record<string, any>) {}
    static parse(data: Record< string, any> ) {
        return new ManDef(
            ManInfo.parse(data.info), 
            parse_dict(data.mps, ManParm.parse),
            data.eds,
    )}
}



export class Measurement{
    constructor(
        readonly value: number[],
        readonly expected: number,
        readonly direction: Point[],
        readonly visibility: number[]
    ) {}

    static parse(data: Record<string, any> ) {
        return new Measurement(
            data.value,
            data.expected,
            Object.values(data.direction).map(p => new Point(p.x, p.y, p.z)),
            data.visibility
    )}

}


export class Result{
    constructor (
        readonly name: string, 
        readonly measurement: Measurement,
        readonly sample: number[],
        readonly errors: number[],
        readonly dgs: number[],
        readonly keys: string[] | number[],
        readonly total: number
    ) {}
    static parse(data: Record<string, any>) {
        let m: Measurement | number[];
        if (typeof data.measurement === 'undefined') {
            m=[];
        } else {
            if (data.measurement.constructor == Object) {m=Measurement.parse(data.measurement);} else {m=data.measurement;}
        }
        return new Result(data.name, m, data.sample, data.errors, data.dgs, data.keys, data.total);
    }

    factoredDG(difficulty: (v: number)=>number) {
        if (this.dgs.length == 0) {return 0;}
        return sum(this.dgs.map(v=>difficulty(v)));
    }

}



export class Results{
    constructor(
        readonly name: string, 
        readonly data: Record<string, Result>, 
        readonly summary: Record< string, number[]>,
        readonly total: number
    ) {}

    static parse(data: Record<string, any>) {
        return new Results(
            data.name, 
            parse_dict(data.data, Result.parse),
            data.summary,
            data.total
        )
    }

    factoredDG(difficulty: (v: number)=>number) {
        if (Object.values(this.data).length == 0) {return 0;}
        return sum(Object.values(this.data).map(v=>v.factoredDG(difficulty)));
    }


}

export class ElementsResults{
    constructor(
        readonly data: Record<string, Results>, 
        readonly summary: Record< string, number[]>,
        readonly total: number
    ) {}

    static parse(data: Record<string, any>) {return new ElementsResults(
        parse_dict(data.data, Results.parse),
        data.summary,
        data.total
    )}

    all_fields() {
        const af: string[] = [];
        $: Object.values(this.data).forEach((results) => {
            Object.values(results.data).forEach(result => {
                af.push(result.name);
            });
        });
        return Array.from(new Set(af));
    }

    get_downgrades(field='Total') {
        const scores: Record<string, number> = {};
        Object.entries(this.data).forEach(([k, v]) => {
            if (field == 'Total') {
                scores[k] = v.total;
            } else if (field in v.data) {
                scores[k] = v.data[field].total;
            } else {
                scores[k] = 0;
            } 
        })
        
        return scores
    }

    check_field(field='Total') {
        const scores: Record<string, boolean> = {};
        Object.entries(this.data).forEach(([k, v]) => {
            if (field == 'Total') {
                scores[k] = true;
            } else if (field in v.data) {
                scores[k] = true;
            } else {
                scores[k] = false;
            } 
        })
        
        return scores
    }

    summaries() {
        const summaries: Record<string, Record<string, number|null>> = {};
        const allfields: string[] = this.all_fields();

        Object.entries(this.data).forEach(([k, v]) => {
            summaries[k] = {}
            allfields.forEach(f => {
                if (f in v.data) {summaries[k][f] = v.data[f].total;} else {summaries[k][f] = null;}
            });
            summaries[k]['Total'] = v.total;
        })
        return summaries;
    }

    factoredDG(difficulty: (v: number)=>number) {
        return sum(Object.values(this.data).map(v=>v.factoredDG(difficulty)));
    }

}



export class ManoeuvreResult{
    constructor (
        readonly inter: Results,
        readonly intra: ElementsResults,
        readonly positioning: Results,
        readonly summary: Record<string, number>,
        readonly score: number
    ) {}
    static parse(data: Record<string, any>) {return new ManoeuvreResult(
        Results.parse(data.inter),
        ElementsResults.parse(data.intra),
        Results.parse(data.positioning),
        data.summary,
        data.score
    )}
}





export function getEl(ename: string, man: Record<string, any>) {
    if (ename == 'entry_line') {
        return man.entry_line;
    }
    for (let i=0; i<man.elements.length; i++) {
        if (man.elements[i].uid == ename) {
        return man.elements[i];
        }
    }
}

function remove_ret(name:string, data: Record<string, any>) {
    let outp: Record<string, any> = {};
    Object.entries(data).forEach(v=>{
        if (v[0] != name) {
        outp[v[0]] = v[1];
        }
    });
    return outp;
}

export function elInfo(name: string, man: Record<string, any>) {
    const el = remove_ret('scoring', getEl(name, man));

    function format(input: any) {
      if (typeof input == 'number') {
        return input.toFixed(2)
      } else {
        return String(input)
      }
    }

    return Object.entries(el).map(
      row=>String(row[0]) + '=' + format(row[1])
    );
}
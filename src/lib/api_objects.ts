import {State} from '$lib/geometry';
import { Data } from "dataclass";
import type { readonly } from 'svelte/store';


export function parse_dict(data: Record<string, any>, parser) {
    let outdata: Record<string, any> = {};
    Object.entries(data).forEach(entry => {outdata[entry[0]] = parser(entry[1]);});
    return outdata;
}



export class BoxLocation{
    constructor(readonly h: string, readonly d: string, readonly  o: string) {}
    static parse(data: Record<string, string>) {return new BoxLocation(data.h, data.d, data.o);}
} 

export class ManInfo{
    constructor (
        readonly name: string, readonly short_name: string, 
        readonly k: number, readonly position: string, 
        readonly start: BoxLocation, readonly end: BoxLocation, 
        readonly centre_loc: number) {}
    static parse(data: Record<string, any>) {return new ManInfo(
        data.name, data.short_name, data.k, data.position, BoxLocation.parse(data.start),
        BoxLocation.parse(data.end), data.centre_loc
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

export class Result{
    constructor (
        readonly name: string, 
        readonly measurement: Record<string, any>,
        readonly dgs: number[],
        readonly keys: string,
        readonly value: number
    ) {}
    static parse(data: Record<string, any>) {
        if (data == null) {
            return new Result('', {}, [], '', 0);
        }
        return new Result(
            data.name, data.measurement, data.dgs, data.keys, data.value
        )
    }
}

export class Results{
    constructor(
        readonly name: string, 
        readonly data: Record<string, Result>, 
        readonly summary: Record< string, number[]>,
        readonly value: number
    ) {}

    static parse(data: Record<string, any>) {
        return new Results(
            data.name, 
            parse_dict(data.data, Result.parse),
            data.summary,
            data.value
        )
    }

}



export class ElementsResults{
    constructor(
        readonly data: Record<string, Results>, 
        readonly summary: Record< string, number[]>,
        readonly value: number
    ) {}

    static parse(data: Record<string, any>) {return new ElementsResults(
        parse_dict(data.data, Results.parse),
        data.summary,
        data.value
    )}
}

export class ManoeuvreResult{
    constructor (
        readonly inter: Results,
        readonly intra: ElementsResults,
        readonly side_box: Result,
        readonly top_box: Result,
        readonly centre: Result,
        readonly distance: Result,
        readonly summary: Record<string, number>,
        readonly score: number
    ) {}
    static parse(data: Record<string, any>) {return new ManoeuvreResult(
        Results.parse(data.inter),
        ElementsResults.parse(data.intra),
        Result.parse(data.side_box),
        Result.parse(data.top_box),
        Result.parse(data.centre),
        Result.parse(data.distance),
        data.summary,
        data.score
    )}
}
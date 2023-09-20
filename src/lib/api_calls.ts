import {ManDef, ManoeuvreResult} from '$lib/api_objects';
import {State} from '$lib/geometry';
import { f } from 'vitest/dist/types-3c7dbfa5';

async function server_func(func_name: string, kwargs: Record<string, any>={}) {
    const response = await fetch(
        'http://localhost:5000/' + func_name, 
        {
            method: "POST", mode: "cors", 
            //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: "same-origin", // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
        },
    //    redirect: "follow", // manual, *follow, error
    //    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(kwargs), // body data type must match "Content-Type" header
    });
    if (!response.ok) {
        throw response.status;
    }
    return await response.json();
}


export async function convert_fcj(fcj: Record<string, any>, sinfo: Record<string, any>){
    return server_func('convert_fcj', {'fcj':fcj, 'sinfo':sinfo});
}


export async function align(mdef: Record<string, any>, fl: Record<string, any>){
    const res = await server_func('align', {'mdef':mdef, 'fl':fl});
    return {
        dist: res.dist,
        al: State.parse_arr(res.al)
    }
}



export async function score(mdef: Record<string, any>, al: Record<string, any>, direction: number){
    const data: Record<string, any> = await server_func('score', {mdef, al, direction});
    return {
        mdef: ManDef.parse(data.mdef),
        intended: data.intended,
        intended_template: State.parse_arr(data.intended_template),
        corrected: data.corrected,
        corrected_template: State.parse_arr(data.corrected_template),
        score: ManoeuvreResult.parse(data.score)
    };
}

export async function example(man: string){
    const data = await server_func('example', {man});
    return {
        status: 'example',
        mdef: ManDef.parse(data.mdef),
        al: State.parse_arr(data.al),
        dist: data.dist,
        intended: data.intended,
        intended_template: State.parse_arr(data.intended_template),
        corrected: data.corrected,
        corrected_template: State.parse_arr(data.corrected_template),
        score: ManoeuvreResult.parse(data.score)
    };
}


export async function example_manlist(){
    return server_func('example_manlist');
}


export async function create_fc_json(sts: State[], mdefs: ManDef[], name: string, category: string) {
    return await server_func('create_fc_json', {sts, mdefs, name, category});
}

export async function server_version(){
    return await server_func('version').then(v=>v.version);
}
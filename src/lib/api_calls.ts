import {ManDef, ManoeuvreResult} from '$lib/api_objects';
import {State} from '$lib/geometry';

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
    return await response.json();
}


export async function convert_fcj(fcj: Record<string, any>, sinfo: Record<string, any>){
    return server_func('convert_fcj', {'fcj':fcj, 'sinfo':sinfo});
}

export async function convert_fcj_example(){
    return server_func('convert_fcj_example');
}

export async function align(mdef: Record<string, any>, fl: Record<string, any>){
    return server_func('align', {'mdef':mdef, 'fl':fl});
}

export async function align_example(man: string){
    return server_func('align_example', {man});
}


export async function score(mdef: Record<string, any>, al: Record<string, any>){
    const data: Record<string, any> = await server_func('score', {'mdef':mdef, 'al':al});
    return {
        mdef: ManDef.parse(data.mdef),
        intended: data.intended,
        intended_template: data.intended_template,
        corrected: data.corrected,
        corrected_template: data.corrected_template,
        score: ManoeuvreResult.parse(data.score)
    }
}

export async function score_example(man: string){
    const data: Record<string, any> = await server_func('score_example', {man});
    return {
        mdef: ManDef.parse(data.mdef),
        intended: data.intended,
        intended_template: data.intended_template,
        corrected: data.corrected,
        corrected_template: data.corrected_template,
        score: ManoeuvreResult.parse(data.score)
    };
}


export async function example_manlist(){
    return server_func('example_manlist');
}

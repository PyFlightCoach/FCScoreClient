import {ManDef} from '$lib/api_objects/mandef';
import {ManoeuvreResult} from '$lib/api_objects/scores';
import type {Manoeuvre} from '$lib/api_objects/manoeuvre';
import { type AlignedMan, type ReadMan, ScoredMan } from '$lib/api_objects/mandata';
import {State, States} from '$lib/geometry';

//0.0.0.0:5000/
async function server_func(func_name: string, kwargs: Record<string, any>={}) {
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${func_name}`, 
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


function parseAnalysis(res: Record<string, any>): AlignedMan | ScoredMan | ReadMan {
    const output: Record<string, any> = {
        mdef: ManDef.parse(res.mdef),
        manoeuvre: res.manoeuvre,
        aligned: States.parse(res.aligned),
        template: States.parse(res.template)
    };

    if ('score' in res) {
        
        output.corrected = res.corrected;
        output.corrected_template= States.parse(res.corrected_template);
        output.score = ManoeuvreResult.parse(res.score);
        
    }
    return ScoredMan.parse(output);
}


export async function analyse_manoeuvre(mdef: Record<string, any>, fl: Record<string, any>, direction: number){
    return parseAnalysis(await server_func('analyse_manoeuvre', {mdef, fl:fl.data, direction}));
}

export async function score_manoeuvre(mdef: ManDef, manoeuvre: Manoeuvre, aligned: States, template: States){
    return parseAnalysis(await server_func('score_manoeuvre', {mdef, manoeuvre, aligned: aligned.data, template:template.data}));
}

export async function create_fc_json(sts: State[], mdefs: ManDef[], name: string, category: string) {
    return await server_func('create_fc_json', {sts, mdefs, name, category});
}

export async function server_version(){
    return await server_func('version').then(v=>v.version);
}

export async function standard_f3a_mps(){
    return await server_func('standard_f3a_mps')
}
import {ManDef} from '$lib/api_objects/mandef';
import {ManoeuvreResult} from '$lib/api_objects/scores';
import type {Manoeuvre} from '$lib/api_objects/manoeuvre';
import { type AlignedMan, type ReadMan, ScoredMan } from '$lib/api_objects/mandata';
import {State, States} from '$lib/geometry';

//0.0.0.0:5000/
async function server_func(func_name: string, kwargs: Record<string, any>={}, method='POST') {
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${func_name}`, 
        {
            method, 
            headers: {"Content-Type": "application/json"},
            mode: "cors",
            body: JSON.stringify(kwargs),
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
        mdef: res.mdef,
        manoeuvre: res.manoeuvre,
        aligned: res.aligned
    };

    if ('score' in res) {
        output.template =  res.template;
        output.corrected = res.corrected;
        output.corrected_template= res.corrected_template;
        output.score = res.score;
    }
    return ScoredMan.parse(output);
}


export async function analyse_manoeuvre(mdef: ManDef, flown: States, direction: number){
    return parseAnalysis(await server_func('analyse_manoeuvre', {mdef, flown:flown.data, direction}));
}

export async function score_manoeuvre(mdef: ManDef, manoeuvre: Manoeuvre, aligned: States, direction: number){
    return parseAnalysis(await server_func('score_manoeuvre', {mdef, manoeuvre, aligned: aligned.data, direction}));
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
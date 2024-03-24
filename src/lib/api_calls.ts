import type {ManDef} from '$lib/api_objects/mandef';
import {ManoeuvreResult} from '$lib/api_objects/scores';
import type {Manoeuvre} from '$lib/api_objects/manoeuvre';
import { type AlignedMan, type BasicMan, ScoredMan } from '$lib/api_objects/mandata';
import type {State, States} from '$lib/geometry';

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


function parseAnalysis(res: Record<string, any>): AlignedMan | ScoredMan | BasicMan {
    return ScoredMan.parse(res);
}


export async function analyse_manoeuvre(man: BasicMan | AlignedMan | ScoredMan){
    return parseAnalysis(await server_func('analyse_manoeuvre', {man}));
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
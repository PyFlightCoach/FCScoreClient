import type {ManDef} from '$lib/api_objects/mandef';
import { type AlignedMan, type BasicMan, ScoredMan } from '$lib/api_objects/mandata';
import type {State} from '$lib/geometry';


async function server_func(func_name: string, kwargs: Record<string, any>={}, method: string='POST') {
    
    let msg = {
        method, 
        headers: {"Content-Type": "application/json"},
        mode: "cors", 
    }
    if (method==='POST') {
        msg.body = JSON.stringify(kwargs);
    }
    
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${func_name}`, 
        msg
    );
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

export async function score_manoeuvre(man: BasicMan | AlignedMan | ScoredMan) {
    return parseAnalysis(await server_func('score_manoeuvre', {man}));
}

export async function create_fc_json(sts: State[], mdefs: ManDef[], name: string, category: string) {
    return await server_func('create_fc_json', {sts, mdefs, name, category});
}

export async function server_version(){
    return await server_func('version').then(v=>v.version);
}


export async function get_telemetry() {
    return await server_func('telemetry');
}
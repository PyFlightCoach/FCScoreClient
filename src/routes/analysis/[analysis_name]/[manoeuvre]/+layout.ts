
import { flightdata } from '$lib/stores';
import {State} from '$lib/geometry';
import { ManDef, ManoeuvreResult } from '$lib/api_objects';
import type { Writable } from 'svelte/store';

export async function load({fetch, params}) {
    
    let mname = params.manoeuvre;
    
    if (mname.split("_")[0] == 'example') {
        mname = mname.split("_")[1];
        const res = await (await fetch('/' + mname + '.json')).json();
        const man = flightdata.addMan(mname);

        man.update((v)=>{return {
            al: State.parse_arr(res.al),
            dist: res.dist,
            mdef: res.mdef,
            intended: res.intended,
            intended_template: State.parse_arr(res.intended_template),
            corrected: res.corrected,
            corrected_template: State.parse_arr(res.corrected_template),
            score: ManoeuvreResult.parse(res.score),
            ...v,
        }})

    }
    
    return {mname}
}
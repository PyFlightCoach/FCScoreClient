import { flightdata } from '$lib/stores';
import {State} from '$lib/geometry';
import { ManDef, ManoeuvreResult } from '$lib/api_objects';
import type { Writable } from 'svelte/store';

export async function load({fetch, params}) {
    let analysis = params.analysis_name;
    
    if (params.analysis_name=='example') {
        const examples = import.meta.glob("/static/examples/*.json");

        let name = flightdata.name;
        name.update(v=>'example');


        for (const path in examples) {
            const mnames = path.split('/')
            const res = await (await fetch('/examples/' + mnames[mnames.length - 1])).json();           

            const man = flightdata.addMan(res.mdef.info.short_name);

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


    }
    return {analysis_name:params.analysis_name}
        
}
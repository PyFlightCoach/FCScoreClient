import { flightdata } from '$lib/stores';
import { ScoredMan } from '$lib/api_objects/mandata';

export async function load({fetch, params}) {
        
    if (params.analysis_name=='example') {
        
        const p23mans = ["tHat", "hSqL", "hB", "hSqLC", "upL", "h8L", "rollC", "pImm", "iSp", "hB2", "rEt", "sqL", "M", "fTrn", "trgle", "sFin", "loop"]
        
        flightdata.set_value('name', 'example');
        flightdata.set_value('sinfo', {category: 'f3a', name: 'p23'});

        for (let i = 0; i<p23mans.length; i++) {
            const mname = p23mans[i];
            const res = await (await fetch('/examples/' + mname + '.json')).json();           
            flightdata.addMan(res.mdef.info.short_name, ScoredMan.parse(res));
        }

    }
    return {analysis_name:params.analysis_name}
        
}
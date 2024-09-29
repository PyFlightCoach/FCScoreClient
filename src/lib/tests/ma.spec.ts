import {describe, expect, it} from 'vitest';

import { MA} from '$lib/ma';
import {ElDef, ManDef} from '$lib/mandef';


import data from '$lib/tests/test_data/trgle.json';


const internals = await MA.parse(data);


describe("Internals", () => {
    
    it('constructor', ()=> {
        expect(internals.mdef).toBeDefined();
        expect(internals.flown).toBeDefined();
        expect(internals.manoeuvre).toBeDefined();
        expect(internals.template).toBeDefined();
        expect(internals.corrected).toBeDefined();
        expect(internals.corrected_template).toBeDefined();
        expect(internals.scores).toBeDefined();
    })

})


describe("MDef", () => {
    it('constructor', ()=> {
        expect(internals.mdef).toBeInstanceOf(ManDef);
    })
    it('getDG', ()=> {
        const dg = internals.mdef.getEd('e_0')!.getDG('curvature');
        expect(dg).toBeDefined();
    })
})


describe("EDef", () => {
    const ed = internals.mdef.getEd('e_0');
    it('constructor', ()=> {
        expect(ed).toBeInstanceOf(ElDef);
    })
    it('getDG', ()=> {      
        const dg = ed!.getDG('curvature');
        expect(dg).toBeDefined();
    })

})
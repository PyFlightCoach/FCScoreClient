import {describe, expect, it} from 'vitest';
import {BoxLocation, Heights, Directions, Orientations} from '$lib/api_objects/mandef';


import {parse_dict} from '$lib/arrays';

describe("boxloc", () => {
    it("fromdata", () => {
        const bl = BoxLocation.parse({h:'BTM', d:'UPWIND', o:'DRIVEN'})
        expect(bl.h).toBe(Heights.BTM);
        expect(bl.d).toBe(Directions.UPWIND);
        expect(bl.o).toBe(Orientations.DRIVEN);
    })

    it("stringify", ()=> {
        const bl = new BoxLocation(Heights.BTM, Directions.UPWIND, Orientations.DRIVEN);
        const blstr = JSON.stringify(bl);
        expect(blstr).toBe('{"h":"BTM","d":"UPWIND","o":"DRIVEN"}');
        const bl2 = BoxLocation.parse(JSON.parse(blstr));
        expect(bl2).toStrictEqual(bl);
    })
    it("parse_dict", ()=> {
        const data={
            a: {h:'BTM', d:'DOWNWIND', o:'INVERTED'},
            b: {h:'BTM', d:'DOWNWIND', o:'INVERTED'}
        }
        const bls = parse_dict(data, BoxLocation.parse);
        expect(bls.a).toStrictEqual(BoxLocation.parse(data.a));
        expect(bls.b).toStrictEqual(BoxLocation.parse(data.b));
    })
})



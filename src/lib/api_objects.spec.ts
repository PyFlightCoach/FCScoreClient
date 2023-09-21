import {describe, expect, it} from 'vitest';
import {BoxLocation, parse_dict, Height, Direction, Orientation} from '$lib/api_objects';


describe("boxloc", () => {
    it("fromdata", () => {
        const bl = BoxLocation.parse({h:'BTM', d:'UPWIND', o:'DRIVEN'})
        expect(bl.h).toBe(Height.BTM);
        expect(bl.d).toBe(Direction.UPWIND);
        expect(bl.o).toBe(Orientation.DRIVEN);
    })

    it("stringify", ()=> {
        const bl = new BoxLocation(Height.BTM, Direction.UPWIND, Orientation.DRIVEN);
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



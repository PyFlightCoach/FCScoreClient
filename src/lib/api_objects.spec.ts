import {describe, expect, it} from 'vitest';
import {BoxLocation, parse_dict} from '$lib/api_objects';


describe("boxloc", () => {
    it("fromdata", () => {
        const bl = BoxLocation.parse({h:'a', d:'b', o:'c'})
        expect(bl.h).toBe('a');
        expect(bl.d).toBe('b');
        expect(bl.o).toBe('c');
    })
    it("stringify", ()=> {
        const bl = new BoxLocation('a', 'b', 'c');
        const blstr = JSON.stringify(bl);
        expect(blstr).toBe('{"h":"a","d":"b","o":"c"}');
        const bl2 = BoxLocation.parse(JSON.parse(blstr));
        expect(bl2).toStrictEqual(bl);
    })
    it("parse_dict", ()=> {
        const data={
            a: {h:'a', d:'b', o:'c'},
            b: {h:'d', d:'e', o:'f'}
        }
        const bls = parse_dict(data, BoxLocation.parse);
        expect(bls.a).toStrictEqual(BoxLocation.parse(data.a));
        expect(bls.b).toStrictEqual(BoxLocation.parse(data.b));
    })
})



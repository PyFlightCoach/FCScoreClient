import {describe, expect, it} from 'vitest';
import {linspace} from '$lib/arrays';

describe("array methods", ()=>{
    it("linspace", ()=>{
        expect(linspace(0,4,5)).toStrictEqual([0,1,2,3,4])
        expect(linspace(0,2,5)).toStrictEqual([0,0.5,1,1.5,2])
    })
})
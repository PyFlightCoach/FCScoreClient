import {describe, expect, it} from 'vitest';
import {FCJson, FCJData, FCJParams, FCJMan, Origin} from '$lib/api_objects/fcjson';

import fcjson from '$lib/test_data/manual_F3A FAI_F25_24_06_02_00000094.json';
import {State, Point} from '$lib/geometry';

const fcj = FCJson.parse(Object.setPrototypeOf(fcjson, FCJson.prototype));

describe("fc_json", () => {
    
    it('constructor', ()=> {
        expect(fcj.mans[0]).toBeInstanceOf(FCJMan);
        expect(fcj.data[0]).toBeInstanceOf(FCJData);
        expect(fcj.parameters).toBeInstanceOf(FCJParams);
        expect(fcj.origin).toBeInstanceOf(Origin);
        
    })

    it("set prototype", () => {
        const fcj = Object.setPrototypeOf(fcjson, FCJson.prototype);
        expect(fcj).toBeInstanceOf(FCJson);
    })
})



import {describe, expect, it} from 'vitest';
import {FCJson, FCJData, FCJParams, FCJMan, Origin} from '$lib/fcjson';
import {GPS} from '$lib/geometry';
import fcjson from '$lib/tests/test_data/manual_F3A FAI_F25_24_06_02_00000094.json';


const fcj = FCJson.parse(fcjson);

describe("fc_json", () => {
    
    it('constructor', ()=> {
        expect(fcj.mans[0]).toBeInstanceOf(FCJMan);
        expect(fcj.data[0]).toBeInstanceOf(FCJData);
        expect(fcj.parameters).toBeInstanceOf(FCJParams);
        expect(fcj.origin).toBeInstanceOf(Origin);
        
    })

});


describe("Origin", () => {
 
    it("from centre", () => {
        const origin = Origin.from_centre(
            new GPS(51.6416787, -2.5257777, 10),
            new GPS(51.64241177060382, -2.5266143823510574, 10),
        )
        expect(180 * origin.heading / Math.PI).toBeCloseTo(-35.3, 1);
    });




});

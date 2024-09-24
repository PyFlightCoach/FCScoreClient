import {describe, expect, it} from 'vitest';
import {FCJson, FCJData, FCJParams, FCJMan, Origin} from '$lib/api_objects/fcjson';
import {GPS} from '$lib/geometry';
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

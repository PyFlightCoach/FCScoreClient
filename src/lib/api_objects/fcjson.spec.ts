import {describe, expect, it} from 'vitest';
import {FCJson, FCJData, FCJParams} from '$lib/api_objects/fcjson';
import {  Man } from "./api_objects/mandata";
import fcjson from '$lib/test_data/manual_F3A FAI_F25_24_06_02_00000094.json';
import {State, Point} from '$lib/geometry';

const fcj = FCJson.parse(Object.setPrototypeOf(fcjson, FCJson.prototype));

describe("fc_json", () => {
    it("split_fcj", () => {
        const sbms = fcj.split();
        expect(sbms.length).toBe(17);
        expect(sbms[0].data.length).toBe(910);
        expect(sbms[0]).toStrictEqual(new Man(
            false,
            fcj.parameters,
            0,
            'sLoop',
            fcj.data.slice(916, 910+916),
            1
        ));
    })
    it('create state from data', ()=> {
        expect(fcj.data[0]).toBeInstanceOf(FCJData);
        expect(fcj.parameters).toBeInstanceOf(FCJParams);
        const state = fcj.data[0].create_state(fcj.parameters);
        
        expect(state.pos().x).toBeCloseTo(6.334);
        expect(state.rw).toBeCloseTo(0.034);

        expect(state.direction()).toBe(1);
        expect(Math.sign(state.att().transform_point(new Point(1,0,0)).x)).toBeCloseTo(1);
    })

    it("set prototype", () => {
        const fcj = Object.setPrototypeOf(fcjson, FCJson.prototype);
        expect(fcj).toBeInstanceOf(FCJson);
    })
})



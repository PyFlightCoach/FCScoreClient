import {describe, expect, it} from 'vitest';
import {Point, Quaternion, GPS} from '$lib/geometry';


describe("Point", () => {
    it("dot product", () => {
        expect(
            Point.dot(new Point(1, 2, 3), new Point(10, 20, 30))
        ).toBe(140);
    })
    it("cross product", () => {
        expect(
            Point.cross(new Point(1, 2, 3), new Point(1,2,3))
        ).toStrictEqual(new Point(0,0,0));   
    })
})


describe("Quaternion", () => {
    it("axis", () => {
        expect(new Quaternion(1, 1,2,3).axis()
        ).toStrictEqual(new Point(1,2,3));
    })

    it("mul", () => {
        expect(
            Quaternion.mul(new Quaternion(1,1,1,1), new Quaternion(1,1,1,1))
        ).toStrictEqual(new Quaternion(-2,2,2,2))

        expect(
            Quaternion.mul(new Quaternion(1,1,1,1), new Quaternion(1,-1,-1,-1))
        ).toStrictEqual(new Quaternion(4,0,0,0))

        expect(
            Quaternion.mul(new Quaternion(1,2,3,4), new Quaternion(1,-1,-1,-1))
        ).toStrictEqual(new Quaternion(10,2,0,4))
    })

    it("transform_point", () => {
        expect(
            new Quaternion(0,1,1,1).transform_point(new Point(1,2,3))
        ).toStrictEqual(
            new Point(5.196152422706633,3.4641016151377553,1.7320508075688774)
        )
        expect(
            new Quaternion(1,0,0,0).transform_point(new Point(1,2,3))
        ).toStrictEqual(new Point(1,2,3))

        expect(
            new Quaternion(1,1,0,0).transform_point(new Point(1,2,3))
        ).toStrictEqual(new Point(1.414213562373095,-4.242640687119285,2.82842712474619))


    })
    it('from euler', () => {
        expect(Quaternion.parse_euler(new Point(0,0,0)).w).toBe(1);
        expect(Quaternion.parse_euler(new Point(0,0,0)).x).toBe(0);
        expect(Quaternion.parse_euler(new Point(Math.PI,0,0)).w).toBeCloseTo(0);
    })
})


describe("GPS", () => {

    it("sub", () => {
        const g1 = new GPS(51.6416787,-2.5257777, 10);
        const g2 = new GPS(51.64241177060382, -2.5266143823510574, 10);
        const p = GPS.sub(g2, g1);
        expect(p.z).toBeCloseTo(0, 1);
        expect(p.x).toBeCloseTo(81.6, 1);
        expect(p.y).toBeCloseTo(-57.8, 1);
        
    })

})


import {Point, Quaternion} from '$lib/geometry';

import {OBJ} from '$lib/plots/traces';
export const prerender = true;
export const ssr=false;

export async function load({ fetch, params }) {
    const res = await fetch('/cold_draft');
    const cd_data = await res.json();

    const colddraft = OBJ.parse(
        cd_data, 
        new Point(0.75, 0, 0), 
        new Quaternion(0, 0.70710678, -0.70710678, 0) 
    ).scale(5);    
    
    return {colddraft}
}


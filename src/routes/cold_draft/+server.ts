import {json} from '@sveltejs/kit';
import fs from 'fs';
import {OBJ} from '$lib/plots/traces';
import {Point, Quaternion} from '$lib/geometry';

export const prerender = true;

export function GET() {
    
    const cd_data = fs.readFileSync('static/ColdDraftF3APlane.obj', 'utf8').toString();
    const colddraft = OBJ.parse(
        cd_data, 
        new Point(0.75, 0, 0), 
        new Quaternion(0, 0.70710678, -0.70710678, 0) 
    ).scale(5);  
    return json(colddraft);
}
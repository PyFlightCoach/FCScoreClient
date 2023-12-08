import {json} from '@sveltejs/kit';
import fs from 'fs';


export function GET() {
    
    return json(fs.readFileSync('static/ColdDraftF3APlane.obj', 'utf8').toString());
}
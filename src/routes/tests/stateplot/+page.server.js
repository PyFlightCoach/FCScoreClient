import fs from 'fs';



export function load() {
  const objfile = fs.readFileSync('static/ColdDraftF3APlane.obj', 'utf8');
	return {obj:objfile.toString()};
}

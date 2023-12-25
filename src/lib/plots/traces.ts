import { State, Point, Quaternion, States } from '$lib/geometry';
import { linspace } from '$lib/arrays';
import ObjFile from 'obj-file-parser';

export const ribbon = (st: States, sp: number, expandprops: Record<string, any[]>={}, props: Record<string, any> = {}) => {
	const semisp = sp / 2;

	let points: Point[] = [];


	Object.keys(expandprops).forEach(key => {
		props[key] = [];
	})

	for (let i = 0; i < st.data.length; i++) {
		points.push(st.data[i].body_to_world(new Point(0, semisp, 0)));
		points.push(st.data[i].body_to_world(new Point(0, -semisp, 0)));
	}


	let _i: number[] = [];
	let _j: number[] = [];
	let _k: number[] = [];
	for (let i = 0; i < points.length - 2; i += 2) {
		_i.push(i);      _j.push(i + 1); _k.push(i + 2);
		_i.push(i + 1);  _j.push(i + 3); _k.push(i + 2);
		
		Object.entries(expandprops).forEach(([key, val]) => {
			props[key].push(val[i]);
			props[key].push(val[i]);
			props[key].push(val[i]);
			props[key].push(val[i]);
		})

	}

	let data: Record<string, number[]> = { x: [], y: [], z: [] };
	points.forEach((val: Record<string, any>) => {
		data.x.push(val.x);
		data.y.push(val.y);
		data.z.push(val.z);
	});

	return { ...data, i: _i, j: _j, k: _k, type: 'mesh3d', ...props };
};

export const coloured_ribbons = (states: Record<string, States>, span: number) => {
	return Object.keys(states).map((el) => {
		return { ...ribbon(states[el], span), name: el };
	});
};

export const vectors = (
	pos: Point[],
	vec: Point[],
	text: string[] | null = null
): Record<string, any>[] => {
	let trs: Record<string, any>[] = [];
	for (let i = 0; i < pos.length; i++) {
		trs.push({
			type: 'scatter3d',
			x: [pos[i].x, pos[i].x + vec[i].x],
			y: [pos[i].y, pos[i].y + vec[i].y],
			z: [pos[i].z, pos[i].z + vec[i].z],
			mode: 'lines',
			line: { color: 'black', width: 2 },
			showlegend: false,
			text: text == null ? '' : text[i]
		});
	}

	return trs;
};

export const single_point = (x = 0, y = 0, z = 0) => {
	return {
		type: 'scatter3d',
		x: [x],
		y: [y],
		z: [z],
		mode: 'markers',
		name: 'pilot position',
		showlegend: false
	};
};

export const points = (pos: Point[], text: string[] | null = null): Record<string, any>[] => {
	let trs: Record<string, any>[] = [];
	for (let i = 0; i < pos.length; i++) {
		trs.push({
			type: 'scatter3d',
			x: [pos[i].x],
			y: [pos[i].y],
			z: [pos[i].z],
			mode: 'markers',
			marker: { color: 'black', size: 3 },
			showlegend: false,
			text: text == null ? '' : text[i]
		});
	}

	return trs;
};

export const downgrade_info = (result: Record<string, any>, scale = 1.0) => {
	let info: string[] = [];
	for (let i = 0; i < result.keys.length; i++) {
		info.push(
			'measurement = ' +
				(result.measurement.value[result.keys[i]] * scale).toFixed(2) +
				'<br>error = ' +
				(result.errors[i] * scale).toFixed(1).toString() +
				'<br>visibility = ' +
				result.measurement.visibility[result.keys[i]].toFixed(2).toString() +
				'<br>downgrade = ' +
				result.dgs[i].toFixed(2).toString()
		);
	}

	return [
		{
			type: 'scatter',
			y: result.measurement.value.map((p) => {
				if (p != null) {
					return p * scale;
				} else {
					return null;
				}
			}),
			name: 'measurement',
			line: { color: 'black', width: 1 },
			hoverinfo: 'skip',
			yaxis: 'y'
		},
		{
			type: 'scatter',
			y: result.measurement.visibility,
			name: 'visibility',
			line: { color: 'blue', width: 1, dash: 'dot' },
			hoverinfo: 'skip',
			yaxis: 'y2'
		},
		{
			type: 'scatter',
			y: result.sample.map((p) => {
				if (p != null) {
					return p * scale;
				} else {
					return null;
				}
			}),
			name: 'downgradable error',
			line: { width: 3 },
			hoverinfo: 'skip',
			yaxis: 'y'
		},
		{
			type: 'scatter',
			x: result.keys,
			y: result.keys.map((k) => result.sample[k] * scale),
			text: result.dgs.map((dg) => dg.toFixed(3)),
			hovertext: info,
			name: 'downgrades',
			mode: 'markers+text',
			marker: {
				size: 12,
				color: result.dgs,
				colorscale: 'Reds'
			},
			textposition: 'bottom center',
			yaxis: 'y'
		}
	];
};

export const criteriaInfo = (criteria: Record<string, any>, scale: number) => {
	const x =
		criteria.comparison == 'absolute' ? linspace(0.0, 90.0, 20.0) : linspace(0.0, 5.0, 20.0);

	const y = x.map((v) => criteria.lookup.factor * Math.pow(v / scale, criteria.lookup.exponent));

	return { type: 'scatter', x, y, line: { color: 'black' } };
};

export const boxtrace = () => {
	const xlim = 170 * Math.tan((60 * Math.PI) / 180);
	const ylim = 170;

	return {
		x: [0, xlim, 0, -xlim, xlim, 0, -xlim],
		y: [0, ylim, ylim, ylim, ylim, ylim, ylim],
		z: [0, 0, 0, 0, xlim, xlim, xlim],
		i: [0, 0, 0, 0, 0],
		j: [1, 2, 1, 3, 4],
		k: [2, 3, 4, 6, 6],
		opacity: 0.4,
		color: 'grey',
		type: 'mesh3d'
	};
};

export class OBJ {
	vertices: Point[];
	faces: number[][];
	normals: Point[];
	constructor(vertices: Point[], faces: number[][], normals: Point[]) {
		this.vertices = vertices;
		this.faces = faces;
		this.normals = normals;
	}

	static parse_dict(data: OBJ) {
		return new OBJ(
			data.vertices.map((v) => new Point(v.x, v.y, v.z)),
			data.faces,
			data.normals.map((v) => new Point(v.x, v.y, v.z))
		);
	}

	static from_objfile(file: string) {
		const obj = new ObjFile(file).parse();
		const vertices = obj.models[0].vertices.map((v) => new Point(v.x, v.y, v.z));
		const faces = obj.models[0].faces.map((f) => [
			f.vertices[0].vertexIndex,
			f.vertices[1].vertexIndex,
			f.vertices[2].vertexIndex
		]);
		const normals = obj.models[0].vertexNormals.map((v) => new Point(v.x, v.y, v.z));

		return new OBJ(vertices, faces, normals);
	}

	static parse(file: string, offset: Point | null = null, rotate: Quaternion | null = null) {
		const lines = file.split('\n');
		let vertices: Point[] = [];
		const faces: number[][] = [];
		let normals: Point[] = [];

		lines.forEach((line) => {
			const tokens = line.split(' ');
			if (tokens[0] == 'v') {
				vertices.push(
					new Point(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]))
				);
			} else if (tokens[0] == 'f') {
				faces.push(tokens.slice(1).map((t) => parseInt(t) - 1));
			} else if (tokens[0] == 'vn') {
				normals.push(
					new Point(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]))
				);
			}
		});
		if (rotate != null) {
			vertices = vertices.map((v) => rotate.transform_point(v));
			normals.forEach((n) => rotate.transform_point(n));
		}
		if (offset != null) {
			vertices = vertices.map((v) => v.offset(offset));
		}

		return new OBJ(vertices, faces, normals);
	}

	scale(s: number) {
		return new OBJ(
			this.vertices.map((v) => v.mul(s)),
			this.faces,
			this.normals
		);
	}

	to_mesh3d(p: Point, q: Quaternion, props: Record<string, any> = {}) {
		const vertices = this.vertices.map((v) => p.offset(q.transform_point(v)));
		return {
			x: vertices.map((v) => v.x),
			y: vertices.map((v) => v.y),
			z: vertices.map((v) => v.z),
			i: this.faces.map((f) => f[0]),
			j: this.faces.map((f) => f[1]),
			k: this.faces.map((f) => f[2]),
			type: 'mesh3d',
			showscale: false,
			...props,
			//flatshading: true,
			lighting: {
				ambient: 0.5,
				diffuse: 1.0,
				fresnel: 0.2,
				specular: 0.1,
				roughness: 0.1,
				facenormalsepsilon: 1e-6,
				vertexnormalsepsilon: 1e-12
			},
			lightposition: { x: 100, y: 0, z: 1000 }
		};
	}
}

export const modeltrace = (sts: States, model: OBJ, props: Record<string, any> = {}) => {
	return sts.data.map((st) => model.to_mesh3d(st.pos(), st.att(), props));
};

import {d3Colors} from '$lib/plots/styling';

export const alignment_traces = (sts: Record<string, States>, showmodels: boolean, 
    showbox: boolean, obj: OBJ|null, nmodels: number, hid: number|null) => {
    const trs = [];

    
    for (let i = 0; i < Object.keys(sts).length; i++) {
      let k = Object.keys(sts)[i];
      let v = Object.values(sts)[i];
      
      const props = {
        color: d3Colors[i % d3Colors.length],
        name: k
      };
      if ((i == hid) || (hid == null)) {

        if (showmodels && (obj != null)){
          trs.push(...modeltrace(
            v.downsample(nmodels), 
            obj, 
            {opacity: 1.0, ...props}
          ));
        }
        

        trs.push(ribbon(v, 3, {}, {opacity: 0.8, showlegend:false, ...props}));
      } else {
        trs.push(ribbon(v, 3, {}, {opacity: 0.2, ...props}));
      } 
      
    }
    if (showbox) {trs.push(boxtrace())};
    return trs;
  }
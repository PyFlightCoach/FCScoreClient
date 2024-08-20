import { parse_dict } from '$lib/arrays';
import { Result } from './scores';

export const Heights = ['BTM', 'MID', 'TOP'] as const;
export const Directions = ['DRIVEN', 'UPWIND', 'DOWNWIND'] as const;
export const Orientations = ['DRIVEN', 'UPRIGHT', 'INVERTED'] as const;
export const Positions = ['CENTRE', 'END'] as const;
export type Height = (typeof Heights)[number];
export type Direction = (typeof Directions)[number];
export type Orientation = (typeof Orientations)[number];
export type Position = (typeof Positions)[number];

export class BoxLocation {
	constructor(
		readonly h: Height,
		readonly d: Direction,
		readonly o: Orientation
	) {}
}

export class ManInfo {
	constructor(
		readonly name: string,
		readonly short_name: string,
		readonly k: number,
		readonly position: Position,
		readonly start: BoxLocation,
		readonly end: BoxLocation,
		readonly centre_points: number[],
		readonly centred_els: number[][]
	) {}

	static parse(data: ManInfo) {
		return new ManInfo(
			data.name,
			data.short_name,
			data.k,
			data.position,
			Object.setPrototypeOf(data.start, BoxLocation.prototype),
			Object.setPrototypeOf(data.end, BoxLocation.prototype),
			data.centre_points,
			data.centred_els
		);
	}

	static default() {
		return new ManInfo(
			'new manoeuvre',
			'man',
			0,
			'CENTRE',
			new BoxLocation('BTM', 'UPWIND', 'UPRIGHT'),
			new BoxLocation('BTM', 'DRIVEN', 'DRIVEN'),
			[],
			[]
		);
	}
}

export class ManParm {
	constructor(
		readonly name: string,
		readonly criteria: Record<string, any>,
		readonly defaul: any,
		readonly unit: string,
		readonly collectors: Record<string, any>
	) {}

	static parse(data: Record<string, any>) {
		return new ManParm(data.name, data.criteria, data.defaul, data.unit, data.collectors);
	}

	getCollectorEls(els: string[]) {
		return Object.values(this.collectors).map((c: string) => {
			const elList: string[] = [];
			const words = c.split(/[^A-Za-z_0-9]/);
			els.forEach((el: string) => {
				if (words.includes(el)) {
					elList.push(el);
				}
			});
			return elList;
		});
	}
}

export class Criteria {
	constructor(
		readonly lookup: Record<string, any>,
		readonly kind: string,
		readonly bound: number | number[] | undefined = undefined,
		readonly cutoff: number | undefined = undefined,
		readonly limit: number | undefined = undefined
	) {}
	static parse(data: Record<string, any>) {
		return new Criteria(data.lookup, data.kind, data.bound, data.cutoff, data.limit);
	}
}

export class DownGrade {
	constructor(
		readonly name: string,
		readonly measure: string,
		readonly smoothers: string[],
		readonly selectors: string[],
		readonly criteria: Criteria,
		readonly display_name: string
	) {}

	description(result: Result) {
		let fac = result.scale();// result.measurement.unit == 'rad' ? 180 / Math.PI : 1;
		let unit = result.measurement.unit.replace('rad', '°');
		switch (this.criteria.kind){
			case 'Single': 
				return `The ${this.selectors![0].substring(0, this.selectors![0].length - 2).replaceAll("_", " ")} value is downgraded.`;
			case 'Limit': 
				return `The ${this.selectors![0].substring(0, this.selectors![0].length - 2).replaceAll("_", " ")} value is downgraded if it exceeds ${(this.criteria.limit! * fac).toFixed(2)} ${unit}.`;
			case 'Continuous': 
				return 'All peaks in the absolute value of the sample are downgraded.';
			case 'ContinuousValue': 
				return 'All peaks and troughs are downgraded.';
			case 'MaxBound': 
				return `All values above ${(this.criteria.bound * fac).toFixed(2)} ${unit} are downgraded.`;
			case 'MinBound': 
				return `All values below ${(this.criteria.bound * fac).toFixed(2)} ${unit} are downgraded.`;
			case 'InsideBound': 
				return `All values below ${(this.criteria.bound[0] * fac).toFixed(2)} ${unit} or above ${(this.criteria.bound[1] * fac).toFixed(2)} ${unit} are downgraded.`;
			case 'OutsideBound': 
				return `All values between ${(this.criteria.bound[0] * fac).toFixed(2)} ${unit} and ${(this.criteria.bound[1] * fac).toFixed(2)} ${unit} are downgraded.`;
			case 'Peak': 
				return `The largest absolute value above ${(this.criteria.limit  * fac).toFixed(2)} ${unit} is downgraded.`;
		  };
	}


	static parse(data: Record<string, any>) {
		return new DownGrade(
			data.name,
			data.measure,
			data.smoothers,
			data.selectors,
			Criteria.parse(data.criteria),
			data.display_name
		);
	}


}

export class ElDef {
	constructor(
		readonly name: string,
		readonly Kind: string,
		readonly props: Record<string, any>,
		readonly dgs: Record<string, DownGrade>
	) {}
	static parse(data: Record<string, any>) {
		const dgs = Object.fromEntries(Object.entries(data.dgs).map(([k, v]) => {
			return [k, DownGrade.parse(v)];
		}));

		return new ElDef(data.name, data.Kind, data.props, dgs);
	}

	getDG(critn: string | null) {
		for (let dg in this.dgs) {
			if (this.dgs[dg].display_name == critn || dg == critn) {
				return this.dgs[dg];
			}
		}
	}
}

export class ManDef {
	constructor(
		readonly info: ManInfo,
		readonly mps: Record<string, ManParm>,
		readonly eds: Record<string, ElDef>,
		readonly options: ManDef[] | null = null
	) {}
	static parse(data: Record<string, any> | Record<string, any>[]): ManDef {
		if (Array.isArray(data)) {
			return new ManDef(
				ManInfo.parse(data[0].info),
				parse_dict(data[0].mps, ManParm.parse),
				data[0].eds.map(ElDef.parse),
				data.slice(1).map(ManDef.parse)
			);
		} else {
			return new ManDef(
				ManInfo.parse(data.info),
				parse_dict(data.mps, ManParm.parse),
				Object.fromEntries(
					Object.entries(data.eds).map(([k, v]) => {
						return [k, ElDef.parse(v)];
					})
				)
			);
		}
	}

	getEd(dgn: string | null) {
		if (dgn && this.eds[dgn]) {
			return this.eds[dgn];
		}

		for (let ed in this.eds) {
			if (dgn?.startsWith(this.eds[ed].name)) {
				return this.eds[ed];
			}
		}
	}

}

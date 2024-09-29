import {States} from '$lib/state';
import { FCJManResult, ScheduleInfo } from '$lib/fcjson';
import { Origin } from '$lib/fcjson';


export class MAExport {
	constructor(
		readonly name: string,
		readonly id: number,
		readonly sinfo: ScheduleInfo,
		readonly tStart: number,
		readonly tStop: number,
    readonly k: number,
    readonly flown: States,
		readonly history: Record<string, FCJManResult> = {},
	) {}

	static parse(data: any): MAExport {
		return new MAExport(
			data.name,
			data.id,
			Object.setPrototypeOf(data.sinfo, ScheduleInfo.prototype),
			data.tStart,
			data.tStop,
      data.k,
      States.parse(data.states),
			Object.fromEntries(Object.entries(data.history).map(([k, v]) => [k, FCJManResult.parse(v)]))
		);
	}
}

export class AnalysisExport {
	constructor(
		readonly box: Origin,
		readonly isComp: boolean,
		readonly sourceBin: string,
		readonly sourceFCJ: string,
		readonly mans: MAExport[],
	) {}

	static parse(data: any): AnalysisExport {
		return new AnalysisExport(
			Object.setPrototypeOf(data.box, Origin.prototype),
			data.isComp,
			data.sourceBin,
			data.sourceFCJ,
			data.mans.map(MAExport.parse),
		);
	}

  direction() {
    return this.isComp ? this.mans[0].flown.data[0].direction_str() : 'Infer';
  }
}

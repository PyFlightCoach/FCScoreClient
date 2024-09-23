import { States } from '$lib/geometry';
import { FCJManResult, ScheduleInfo } from '$lib/api_objects/fcjson';
import { Origin } from '$lib/api_objects/fcjson';
import { State } from '$lib/geometry';

export class MAExport {
	constructor(
		readonly name: string,
		readonly id: number,
		readonly sinfo: ScheduleInfo,
		readonly start: number,
		readonly stop: number,
    readonly k: number,
		readonly history: Record<string, FCJManResult> = {},
	) {}

	static parse(data: any): MAExport {
		return new MAExport(
			data.name,
			data.id,
			Object.setPrototypeOf(data.sinfo, ScheduleInfo.prototype),
			data.start,
			data.stop,
      data.k,
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
		readonly states: States
	) {}

	static parse(data: any): AnalysisExport {
		return new AnalysisExport(
			Object.setPrototypeOf(data.box, Origin.prototype),
			data.isComp,
			data.sourceBin,
			data.sourceFCJ,
			data.mans.map(MAExport.parse),
			States.parse(data.states)
		);
	}

  direction() {
    return this.isComp ? this.states.data[this.mans[0].start].direction_str() : 'Infer';
  }
}

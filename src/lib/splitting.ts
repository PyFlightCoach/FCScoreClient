import { FCJson, ScheduleInfo, type FCJMan } from '$lib/api_objects/fcjson';
import { listManoeuvres } from '$lib/analysis';
import { manoeuvres, loadManoeuvres } from '$lib/stores';

export class ManDetails {
	constructor(
		readonly name: string,
		readonly id: number,
		readonly k: number,
		readonly sinfo: ScheduleInfo = undefined
	) {}
}

export class ManSplit {
	stop: number;
	constructor(
		readonly name: string,
		readonly sinfo: ScheduleInfo = undefined,
		readonly id: number = undefined,
		stop: number = undefined
	) {
		this.stop = stop;
	}

	static TakeOff(id=0, stop=undefined) {
		return new ManSplit('Takeoff', undefined, id, stop);
	}
	static Break(id=undefined, stop=undefined) {
		return new ManSplit('Break', undefined, id, stop);
	}
	static Landing(id=18, stop=undefined) {
		return new ManSplit('Landing', undefined, id, stop);
	}
}

export async function parseFCJMans(fcjmans: FCJMan[], manDetails: ManDetails[], offset: number) {
	return fcjmans.map((man: FCJMan, i: number) => {
		switch (i) {
			case 0:
				return new ManSplit('Takeoff', undefined, i, man.stop + offset);
			case fcjmans.length - 1:
				return new ManSplit('Landing', undefined, i, man.stop + offset);
			default:
				return new ManSplit(
					manDetails[i - 1].name,
					manDetails[i - 1].sinfo,
					i,
					man.stop + offset
				);
		}

	});
}

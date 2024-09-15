import { States } from '$lib/geometry';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';
import { ManDef } from '$lib/api_objects/mandef';
import { ManoeuvreResult } from '$lib/api_objects/scores';
import { FCJManResult, FCJScore, ScheduleInfo } from '$lib/api_objects/fcjson';
import { serverFunc } from '$lib/api_calls';
import { selectedResult, fa_version, running, runInfo } from '$lib/stores';
import { get } from 'svelte/store';

export class MA {
	constructor(
		readonly name: string,
		readonly id: number,
		readonly schedule: ScheduleInfo,
		readonly scheduleDirection: string,
		readonly flown: States,
		readonly history: Record<string, FCJManResult> = {},
		readonly k: number = undefined,
		readonly mdef: ManDef = undefined,
		readonly manoeuvre: Manoeuvre = undefined,
		readonly template: States = undefined,
		readonly corrected: Manoeuvre = undefined,
		readonly corrected_template: States = undefined,
		readonly scores: ManoeuvreResult = undefined
	) {
		runInfo[id - 1].set(`Empty analysis created at ${new Date().toLocaleTimeString()}`);
	}

	get_score(selectedResult: string, difficulty: number, truncate: boolean) {
		if (!this.history[selectedResult]) {
			return FCJScore.empty();
		} else {
			return this.history[selectedResult].get_score(difficulty, truncate).score;
		}
	}

	async run(optimise: boolean = false) {
		try {
			const res = await serverFunc(
				'analyse_manoeuvre',
				{
					name: this.name,
					category: this.schedule.category,
					schedule: this.schedule.name,
					schedule_direction: this.scheduleDirection,
					flown: this.flown.data,
					optimise_alignment: optimise
				},
				'POST'
			);

			//			let history = this.history;
			//			history[res.fa_version] = FCJManResult.parse(res);
			selectedResult.set(get(fa_version));
      runInfo[this.id - 1].set(`Analysis complete at: ${new Date().toLocaleTimeString()}`);
			return new MA(
				this.name,
				this.id,
				this.schedule,
				this.scheduleDirection,
				States.parse(res.flown),
				{ ...this.history, [res.fa_version]: FCJManResult.parse(res) },
				res.mdef.info.k,
				ManDef.parse(res.mdef),
				Manoeuvre.parse(res.manoeuvre),
				States.parse(res.template),
				Manoeuvre.parse(res.corrected),
				States.parse(res.corrected_template),
				ManoeuvreResult.parse(res.full_scores)
			);
		} catch (err) {
			runInfo[this.id - 1].set(`Analysis Failed: ${err.message}`);
			return this;
		}
	}

	static async parse(data: Record<string, any>) {
		new MA(
			data.mdef.info.short_name,
			0,
			new ScheduleInfo('f3a', 'p25'),
			'RighttoLeft',
			States.parse(data.flown),
			{},
			data.mdef.info.k,
			ManDef.parse(data.mdef),
			Manoeuvre.parse(data.manoeuvre),
			States.parse(data.template),
			Manoeuvre.parse(data.corrected),
			States.parse(data.corrected_template),
			ManoeuvreResult.parse(data.full_scores)
		);
	}
}

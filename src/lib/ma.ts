import { States } from '$lib/state';
import { Manoeuvre } from '$lib/manoeuvre';
import { ManDef } from '$lib/mandef';
import { ManoeuvreResult } from '$lib/scores';
import { FCJManResult, FCJScore, Origin, ScheduleInfo } from '$lib/fcjson';
import { serverFunc } from '$lib/api_calls';
import { selectedResult, fa_version, runInfo, binData, origin } from '$lib/stores';
import { get } from 'svelte/store';



export class MA {
	constructor(
		readonly name: string,
		readonly id: number,
		readonly tStart: number,
		readonly tStop: number,
		readonly schedule: ScheduleInfo,
		readonly scheduleDirection: string,
		readonly history: Record<string, FCJManResult> = {},
		readonly k: number = undefined,
		readonly flown: States = undefined,
		readonly mdef: ManDef = undefined,
		readonly manoeuvre: Manoeuvre = undefined,
		readonly template: States = undefined,
		readonly corrected: Manoeuvre = undefined,
		readonly corrected_template: States = undefined,
		readonly scores: ManoeuvreResult = undefined
	) {}

	summary() {
		return {
			name: this.name,
			id: this.id,
			schedule: this.schedule.to_string(),
			scheduleDirection: this.scheduleDirection,
			k: this.k
		};
	}

	get_score(selectedResult: string, difficulty: number, truncate: boolean) {
		if (!this.history[selectedResult]) {
			return FCJScore.empty();
		} else {
			return (
				this.history[selectedResult].get_score(difficulty, truncate)?.score || FCJScore.empty()
			);
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
					flown: this.flown?.data || get(binData).slice(this.tStart, this.tStop),
          origin: get(origin)?.noMove(),
					optimise_alignment: optimise
				},
				'POST'
			);
			selectedResult.set(get(fa_version));
			runInfo[this.id - 1].set(res.info);
			return new MA(
				this.name,
				this.id,
				this.tStart,
				this.tStop,
				this.schedule,
				this.scheduleDirection,
				{ ...this.history, [res.fa_version]: FCJManResult.parse(res) },
				res.mdef.info.k,
				States.parse(res.flown),
				ManDef.parse(res.mdef),
				Manoeuvre.parse(res.manoeuvre),
				States.parse(res.template),
				res.corrected ? Manoeuvre.parse(res.corrected) : undefined,
				res.corrected_template ? States.parse(res.corrected_template) : undefined,
				res.full_scores ? ManoeuvreResult.parse(res.full_scores) : undefined
			);
		} catch (err) {
			runInfo[this.id - 1].set(`Analysis Failed: ${err.message}`);
			console.trace();
			return this;
		}
	}

  smallexport() {
    return {
      name: this.name,
      id: this.id,
      tStart: this.tStart,
      tStop: this.tStop,
      schedule: this.schedule,
      scheduleDirection: this.scheduleDirection,
      k: this.k,
      flown: this.flown,
      history: this.history
    };
  }


	static parse(data: Record<string, any>) {
    runInfo[data.id - 1].set(`Analysis Imported at ${new Date().toLocaleTimeString()}`);
		return new MA(
			data.mdef.info.short_name,
			data.id,
			data.start,
			data.stop,
			Object.setPrototypeOf(data.schedule, ScheduleInfo.prototype),
			data.scheduleDirection,
			Object.fromEntries(
				Object.entries(data.history).map(([k, v]) => {
					return [k, FCJManResult.parse(v)];
				})
			),
			data.mdef.info.k,
			data.flown ? States.parse(data.flown): undefined,
			data.mdef ? ManDef.parse(data.mdef) : undefined,
			data.manoeuvre ? Manoeuvre.parse(data.manoeuvre) : undefined,
			data.template ? States.parse(data.template) : undefined,
			data.corrected ? Manoeuvre.parse(data.corrected) : undefined,
			data.corrected_template ? States.parse(data.corrected_template) : undefined,
			data.scores ? ManoeuvreResult.parse(data.scores) : undefined,
		);
	}
}

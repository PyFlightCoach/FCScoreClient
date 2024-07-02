import {States} from '$lib/geometry';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';
import { ManDef } from '$lib/api_objects/mandef';
import { ManoeuvreResult } from '$lib/api_objects/scores';
import _ from 'underscore';
import {base} from '$app/paths';


export class Internals{

  constructor (
    readonly mdef: ManDef, readonly flown: States,
    readonly manoeuvre: Manoeuvre | null = null, readonly template: States | null = null, 
    readonly corrected: Manoeuvre | null = null, readonly corrected_template: States | null = null, 
    readonly scores: ManoeuvreResult | null = null,
  ) {}

  static parse(data: Record<string, any>) {
    return new Internals(
      ManDef.parse(data.mdef),
      States.parse(data.flown),
      'manoeuvre' in data ? Manoeuvre.parse(data.manoeuvre) : null,
      'template' in data ? States.parse(data.template) : null,
      'corrected' in data ? Manoeuvre.parse(data.corrected) : null,
      'corrected_template' in data ? States.parse(data.corrected_template) : null,
      'full_scores' in data ? ManoeuvreResult.parse(data.full_scores) : null,
    );
  }

  static async parse_example(name: string) {
    return Internals.parse(await (await fetch(`${base}/example/${name}.json`)).json());
  }

  update (
    mdef: ManDef | null = null, flown: States | null = null,
    manoeuvre: Manoeuvre | null = null, template: States | null = null,
    corrected: Manoeuvre | null = null, corrected_template: States | null = null,
    scores: ManoeuvreResult | null = null
  ) {
    return new Internals(
      mdef === null ? this.mdef : mdef,
      flown === null ? this.flown : flown,
      manoeuvre === null ? this.manoeuvre : manoeuvre,
      template === null ? this.template : template,
      corrected === null ? this.corrected : corrected,
      corrected_template === null ? this.corrected_template : corrected_template,
      scores === null ? this.scores : scores
    )
  }

}

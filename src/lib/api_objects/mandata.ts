import {States} from '$lib/geometry';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';
import { ManDef } from '$lib/api_objects/mandef';
import { ManoeuvreResult } from '$lib/api_objects/scores';
import { FCJData } from '$lib/fcjson';

export class Man{
  busy: boolean;
  constructor (
    busy: boolean,
    readonly id: number,
    readonly name: string,
    readonly els: ElSplit[] | null = null,
    readonly scores: Scores | null = null,
    readonly internals: Internals | null = null
  ) {this.busy=busy;}

  update (data: Record<string, any>) {
    let simplescores = 'score' in data ? data.score : this.scores;
    if ((simplescores !== null) && ('summary' in simplescores)) {
      simplescores = {
        intra: simplescores.intra.total,
        inter: simplescores.inter.total,
        positioning: simplescores.positioning.total,
        total: simplescores.score,
        k: data.mdef.info.k
      };
    }
    return new Man(
      false,
      'id' in data ? data.id : this.id,
      'name' in data ? data.name : this.name,
      'els' in data ? data.els : this.els,
      'score' in data? data.score : this.scores,
      'mdef' in data ? Internals.parse(data) : null,
    )
  }

  edit_split(flown: States) {
    if (this.internals===null) {
      return this;
    } else {
      return new Man(
        false, this.id, this.name, 
        null, null, new Internals(
          this.internals.mdef, flown, this.internals.manoeuvre, 
          this.internals.template
        )
      );
    }
  }
  
}

export class ElSplit{
  constructor (readonly name: string, readonly start: number, readonly stop: number) {}


  static parse (data: ElSplit[]) {
    return data.map((v: ElSplit)=>new ElSplit(v.name, v.start, v.stop));
  }
}


export class Scores{
  constructor (
    readonly intra: number, readonly inter: number, readonly positioning: number, 
    readonly total: number, readonly k: number
  ) {}

  static parse (data: Scores) {
    return new Scores(data.intra, data.inter, data.positioning, data.total, data.k);
  }
}


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

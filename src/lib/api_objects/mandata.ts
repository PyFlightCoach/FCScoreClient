import {States} from '$lib/geometry';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';
import { ManDef } from '$lib/api_objects/mandef';
import { ManoeuvreResult } from '$lib/api_objects/scores';


export class Man{
  busy: boolean;
  constructor (busy: boolean) {this.busy=busy;}
}

export class BasicMan extends Man{
  constructor (
    busy: boolean, readonly mdef: ManDef, 
    readonly flown: States, readonly direction: number, readonly stage: Number) {
    super(busy);
  }
  static parse(data: Record<string, any>) {
    return new BasicMan(
      false,
      ManDef.parse(data.mdef),
      States.parse(data.flown),
      data.direction,
      data.stage
    );
  }
}

export class AlignedMan extends BasicMan{
  constructor(
    busy: boolean, mdef: ManDef,
    flown: States, direction: number, stage: Number,
    readonly manoeuvre: Manoeuvre, 
    readonly template: States) {
    super(busy, mdef, flown, direction, stage);
  }
  static parse(data: Record<string, any>) {
    if (!('manoeuvre' in data)) {
      return BasicMan.parse(data);
    } else {
      return new AlignedMan(
        false,
        ManDef.parse(data.mdef),
        States.parse(data.flown),
        data.direction,
        data.stage,
        Manoeuvre.parse(data.manoeuvre),
        States.parse(data.aligned)
      );
    }
  }
}

export class ScoredMan extends AlignedMan{
  constructor(
    busy: boolean, mdef: ManDef,
    flown: States, direction: number, stage: Number,
    readonly manoeuvre: Manoeuvre, 
    readonly template: States,
    readonly corrected: Manoeuvre,
    readonly corrected_template: States,
    readonly scores: ManoeuvreResult,
    ) {
    super(busy, mdef, flown, direction, stage, manoeuvre, template);
  }
  static parse(data: Record<string, any>): ScoredMan | AlignedMan | BasicMan  {
    if (!('scores' in data)) {
      return AlignedMan.parse(data);
    } else {
      return new ScoredMan(
        false,
        ManDef.parse(data.mdef),
        States.parse(data.flown),
        data.direction,
        data.stage,
        Manoeuvre.parse(data.manoeuvre),
        States.parse(data.template),
        Manoeuvre.parse(data.corrected),
        States.parse(data.corrected_template),
        ManoeuvreResult.parse(data.scores)
      );
    }
  }

}
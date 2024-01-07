import {States} from '$lib/geometry';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';
import { ManDef } from '$lib/api_objects/mandef';
import { ManoeuvreResult } from '$lib/api_objects/scores';



export class ManData{
  busy: boolean;
  constructor (readonly mdef: ManDef, busy: boolean) {this.busy = busy;}
}

export class ReadMan extends ManData{
  constructor (mdef: ManDef, busy: boolean, readonly fl: States) {
    super(mdef, busy);
  }

  static parse(data: Record<string, any>) {
    return new ReadMan(
      ManDef.parse(data.mdef),
      false,
      States.parse(data.fl)
    );
  }
}

export class AlignedMan extends ManData{
  constructor(
    mdef: ManDef, busy: boolean, 
    readonly manoeuvre: Manoeuvre, 
    readonly aligned: States, 
    readonly template: States) {
    super(mdef, busy);
  }
  static parse(data: Record<string, any>) {
    return new AlignedMan(
      ManDef.parse(data.mdef),
      false,
      Manoeuvre.parse(data.manoeuvre),
      States.parse(data.aligned),
      States.parse(data.template),
    );
  }
  static partial_parse(md: ReadMan, data: Record<string, any>) {
    return new AlignedMan(
      md.mdef,
      false,
      Manoeuvre.parse(data.manoeuvre),
      States.parse(data.aligned),
      States.parse(data.template)
    );
  }
}

export class ScoredMan extends AlignedMan{
  constructor(mdef: ManDef, busy: boolean, 
    manoeuvre: Manoeuvre, aligned: States, template: States,
    readonly corrected: Manoeuvre,
    readonly corrected_template: States,
    readonly score: ManoeuvreResult,
    ) {
    super(mdef, busy, manoeuvre, aligned, template);
  }
  static parse(data: Record<string, any>): ScoredMan | AlignedMan | ReadMan  {
    if (!('aligned' in data)) {
      return ReadMan.parse(data);
    } else if (!('score' in data)) {
      return AlignedMan.parse(data);
    } else {
      return new ScoredMan(
        ManDef.parse(data.mdef),
        false,
        Manoeuvre.parse(data.manoeuvre),
        States.parse(data.aligned),
        States.parse(data.template),
        Manoeuvre.parse(data.corrected),
        States.parse(data.corrected_template),
        ManoeuvreResult.parse(data.score),
      )
    }
  }


  static partial_parse(md: AlignedMan, data: Record<string, any>) {
      return new ScoredMan(
        md.mdef,false, md.manoeuvre, md.aligned, md.template,
        Manoeuvre.parse(data.corrected),
        States.parse(data.corrected_template),
        ManoeuvreResult.parse(data.score),
      )
  }
}
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
    constructor(mdef: ManDef, busy: boolean, readonly dist: number, readonly al: States) {
      super(mdef, busy);
    }
    static parse(data: Record<string, any>) {
      return new AlignedMan(
        ManDef.parse(data.mdef),
        false,
        data.dist,
        States.parse(data.al)
      );
    }
    static partial_parse(md: ReadMan, data: Record<string, any>) {
      return new AlignedMan(
        md.mdef,
        false,
        data.dist,
        States.parse(data.al)
      );
    }
  }
  
  export class ScoredMan extends AlignedMan{
    constructor(mdef: ManDef, busy: boolean, dist: number, al:States, 
      readonly intended: Manoeuvre,
      readonly intended_template: States,
      readonly corrected: Manoeuvre,
      readonly corrected_template: States,
      readonly score: ManoeuvreResult,
      ) {
      super(mdef, busy, dist, al);
    }
    static parse(data: Record<string, any>) {
      return new ScoredMan(
        ManDef.parse(data.mdef),
        false,
        0, 
        States.parse(data.al),
        Manoeuvre.parse(data.intended),
        States.parse(data.intended_template),
        Manoeuvre.parse(data.corrected),
        States.parse(data.corrected_template),
        ManoeuvreResult.parse(data.score),
      )
    }
    static partial_parse(md: AlignedMan, data: Record<string, any>) {
        return new ScoredMan(
          md.mdef,false,md.dist, md.al,
          Manoeuvre.parse(data.intended),
          States.parse(data.intended_template),
          Manoeuvre.parse(data.corrected),
          States.parse(data.corrected_template),
          ManoeuvreResult.parse(data.score),
        )
    }
}
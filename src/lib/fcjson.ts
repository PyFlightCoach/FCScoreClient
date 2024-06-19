import { ElSplit } from "$lib/api_objects/mandata";
import {Scores} from "$lib/api_objects/mandata";

export class Origin {
  constructor (
    readonly lat: number,
    readonly lng: number,
    readonly alt: number,
    readonly heading: number,
    readonly move_east: number,
    readonly move_north: number,  
  ) {}
}



export class ScheduleInfo {
  constructor (
    readonly category: string,
    readonly name: string
  ) {}

  static from_fcj_sch(sch: string[]): ScheduleInfo {
    return new ScheduleInfo(sch[0], sch[1]);
  }
}


export class FCJMan {
  constructor (
    readonly name: string,
    readonly k: number,
    readonly id: string,
    readonly sp: number,
    readonly wd: number,
    readonly start: number,
    readonly stop: number,
    readonly sel: boolean,
    readonly background: string,
  ) {}
}

export class FCJData {
  constructor (
    readonly VN: number,
    readonly VE: number,
    readonly VD: number,
    readonly dPD: number,
    readonly r: number,
    readonly p: number,
    readonly yw: number,
    readonly N: number,
    readonly E: number,
    readonly D: number,
    readonly time: number,
    readonly roll: number,
    readonly pitch: number,
    readonly yaw: number,
  ) {}


}

export class FCJParams {
  constructor (
    readonly rotation: number,
    readonly start: number,
    readonly stop: number,
    readonly moveEast: number,
    readonly moveNorth: number,
    readonly wingspan: number,
    readonly modelwingspan: number,
    readonly elevate: number,
    readonly originLat: number,
    readonly originLng: number,
    readonly originAlt: number,
    readonly pilotLat: string,
    readonly pilotLng: string,
    readonly pilotAlt: string,
    readonly centerLat: string,
    readonly centerLng: string,
    readonly centerAlt: string,
    readonly schedule: string[],
  ) {}


}


export class FCJHumanResult {
  constructor (
    readonly name: string,
    readonly date: string,
    readonly scores: number[]
  ) {}
}

export class FCJManResult {
  constructor (
    readonly score: Scores,
    readonly els: ElSplit[]
  ){}
  static parse(data: FCJManResult) {
    return new FCJManResult(
      Scores.parse(data.score),
      ElSplit.parse(data.els)
    );
  }
}

export class FCSResult {
  constructor (
    readonly fcs_version: string,
    readonly date: string,
    readonly difficulty: number,
    readonly truncated: boolean,
    readonly manresults: FCJManResult[],
    readonly total: number,
  ) {}

  static parse(data: FCSResult) {
    return new FCSResult(
      data.fcs_version,
      data.date,
      data.difficulty,
      data.truncated,
      data.manresults.map((v: FCJManResult) => {return FCJManResult.parse(v)}),
      data.total
    )}
}


export class FCJson {
  unique_names: string[]=[];
  short_name: string;
  sinfo: ScheduleInfo;
  origin: Origin;
  constructor (
    readonly version: string, 
    readonly comments: string, 
    readonly name: string,
    readonly view: Record<string, any>,
    readonly parameters: FCJParams,
    readonly scored: boolean,
    readonly scores: number[],
    readonly human_scores: FCJHumanResult[] = [],
    readonly fcs_scores: FCSResult[] = [],
    readonly mans: FCJMan[],
    readonly data: FCJData[],
    readonly jhash: number
  ) {
    
    this.mans.forEach((man: FCJMan)=>{
      let mname = man.name; let i=1;
      while (this.unique_names.includes(mname)) {i++; mname = man.name + i.toString();}
      this.unique_names.push(mname);
    });

    this.short_name = this.name.replace(/\.[^/.]+$/, "");
    this.sinfo = ScheduleInfo.from_fcj_sch(this.parameters.schedule);
    this.origin = new Origin(
      this.parameters.originLat,
      this.parameters.originLng,
      this.parameters.originAlt,
      this.parameters.rotation,
      this.parameters.moveEast,
      this.parameters.moveNorth
    )
  }

  static parse(data: FCJson) {
    return new FCJson(
      data.version, 
      data.comments, 
      data.name,
      data.view,
      Object.setPrototypeOf(data.parameters, FCJParams.prototype),
      data.scored,
      data.scores,
      data.human_scores!,
      data.fcs_scores ? data.fcs_scores.map((v: FCSResult) => {return FCSResult.parse(v)}): [],
      data.mans.map((v: FCJMan) => {return Object.setPrototypeOf(v, FCJMan.prototype)}),
      data.data.map((v: FCJData) => {return Object.setPrototypeOf(v, FCJData.prototype)}),
      data.jhash
    )
  }

  get_mandata(i: number) {
    return this.data.slice(this.mans[i].start, this.mans[i].stop);
  }

  add_result(result: FCSResult): FCJson {

    return new FCJson(
      this.version,
      this.comments,
      this.name,
      this.view,
      this.parameters,
      this.scored,
      this.scores,
      this.human_scores,
      this.fcs_scores.concat(result),
      this.mans,
      this.data,
      this.jhash,
    );
  }

}
import { Man } from "./api_objects/mandata";
import { State, Point, GPS, Quaternion } from "$lib/geometry";


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

  pos() {return new Point(this.N, this.E, this.D);}

  rott() {
    return Quaternion.parse_euler(new Point(this.r, this.p, this.yw).mul(Math.PI / 180))
  }

  create_state(parameters: FCJParams): State {
    const pilotRot = parameters.pilotRot();
    
    const q = this.rott();
    return State.build(
        this.pos(),
        Quaternion.mul(pilotRot, q),
        q.inverse().transform_point(pilotRot.transform_point(new Point(this.VN, this.VE, this.VD))),
    )
  }

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

  pilotPos() {return new GPS(
    Number(this.pilotLat), 
    Number(this.pilotLng), 
    Number(this.pilotAlt)
  );}

  pilotRot() {return Quaternion.parse_euler(
    new Point(Math.PI, 0, this.rotation)
  );}

}

class Origin {
  constructor (
    readonly lat: number,
    readonly lng: number,
    readonly alt: number,
    readonly heading: number,
  ) {}
}

export class FCJson {
  unique_names: string[]=[];
  direction: number;
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
    readonly mans: FCJMan[],
    readonly data: FCJData[],
    readonly jhash: number
  ) {
    
    this.mans.forEach((man: FCJMan)=>{
      let mname = man.name; let i=1;
      while (this.unique_names.includes(mname)) {i++; mname = man.name + i.toString();}
      this.unique_names.push(mname);
    });

    this.direction = this.data[this.mans[1].start].create_state(this.parameters).direction();
    this.short_name = this.name.replace(/\.[^/.]+$/, "");
    this.sinfo = ScheduleInfo.from_fcj_sch(this.parameters.schedule);
    this.origin = new Origin(
      this.parameters.originLat,
      this.parameters.originLng,
      this.parameters.originAlt,
      this.parameters.rotation
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
      data.mans.map((v: FCJMan) => {return Object.setPrototypeOf(v, FCJMan.prototype)}),
      data.data.map((v: FCJData) => {return Object.setPrototypeOf(v, FCJData.prototype)}),
      data.jhash
    )
  }

  get_mandata(i: number) {
    return this.data.slice(this.mans[i].start, this.mans[i].stop);
  }

  

}
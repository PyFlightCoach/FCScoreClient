import { parse_dict } from "$lib/arrays";


export const Heights = ["BTM","MID","TOP"] as const;
export const Directions = ["DRIVEN","UPWIND","DOWNWIND"] as const;
export const Orientations = ["DRIVEN","UPRIGHT","INVERTED"] as const;
export const Positions = ["CENTRE","END"] as const;
export type Height = typeof Heights[number];
export type Direction = typeof Directions[number];
export type Orientation = typeof Orientations[number];
export type Position = typeof Positions[number];


export class BoxLocation{
    constructor(readonly h: Height, readonly d: Direction, readonly  o: Orientation) {}
    static parse(data: BoxLocation) {return new BoxLocation(data.h, data.d, data.o);}
  } 
  
  export class ManInfo{
    constructor (
      readonly name: string, readonly short_name: string, 
      readonly k: number, readonly position: Position, 
      readonly start: BoxLocation, readonly end: BoxLocation, 
      readonly centre_points: number[], readonly centred_els: number[][]) {}
  
    static parse(data: ManInfo) {return new ManInfo(
      data.name, data.short_name, data.k, data.position, BoxLocation.parse(data.start),
      BoxLocation.parse(data.end), data.centre_points, data.centred_els
    )}
  
    static default() {return new ManInfo(
      'new manoeuvre', 'man', 0, "CENTRE",
      new BoxLocation("BTM", "UPWIND", "UPRIGHT"),
      new BoxLocation("BTM", "DRIVEN", "DRIVEN"),
      [],[]
    )}
  }
  
  
  export class ManParm{
    constructor (readonly name: string, readonly criteria: Record<string, any>, 
      readonly defaul: any, readonly collectors: Record<string, any>) {}
      
    static parse(data: Record<string, any>) {return new ManParm(
      data.name, data.criteria, data.default, data.collectors
    )}
  
  }
  
  export class ManDef{
    constructor (readonly info: ManInfo, readonly mps: Record<string, ManParm>, readonly eds: Record<string, any>) {}
    static parse(data: Record< string, any> ) {
      return new ManDef(
        ManInfo.parse(data.info), 
        parse_dict(data.mps, ManParm.parse),
        data.eds,
    )}
  }
  
  
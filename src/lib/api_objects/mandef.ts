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
} 

export class ManInfo{
  constructor (
    readonly name: string, readonly short_name: string, 
    readonly k: number, readonly position: Position, 
    readonly start: BoxLocation, readonly end: BoxLocation, 
    readonly centre_points: number[], readonly centred_els: number[][]) {}

  static parse(data: ManInfo) {return new ManInfo(
    data.name, data.short_name, data.k, data.position, 
    Object.setPrototypeOf(data.start, BoxLocation.prototype),
    Object.setPrototypeOf(data.end, BoxLocation.prototype), 
    data.centre_points, data.centred_els
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
    data.name, data.criteria, data.defaul, data.collectors
  )}
  
  getCollectorEls(els: string[]) {
    return Object.values(this.collectors).map((c: string) => {
      const elList: string[]=[];
      const words = c.split(/[^A-Za-z_0-9]/);
      els.forEach((el: string) => {
        if (words.includes(el)) {
          elList.push(el);
        }
      });
      return elList;
    })
  }


}

export class ManDef{
  constructor (readonly info: ManInfo, readonly mps: Record<string, ManParm>, readonly eds: Record<string, any>, readonly options: ManDef[] | null = null) {}
  static parse(data: Record< string, any> | Record< string, any>[]  ) : ManDef {
    if (Array.isArray(data)) {
      return new ManDef(ManInfo.parse(data[0].info), parse_dict(data[0].mps, ManParm.parse), data[0].eds, data.slice(1).map(ManDef.parse));
    } else {
      return new ManDef(ManInfo.parse(data.info), parse_dict(data.mps, ManParm.parse), data.eds)
    }
  }

  getDG(dgn: string | null, critn: string | null) {
    let odg: Record<string, any> = null;

    if (dgn && critn) {
      if (Object.keys(this.eds).includes(dgn) && Object.keys(this.eds[dgn]).includes(critn)) {
        return this.eds[dgn][critn];
      } 
  
      Object.values(this.eds).forEach((ed: Record<string, any>) => {
        Object.entries(ed.dgs).forEach(([name, dgs]) => {
          
            if (ed.name == dgn || (ed.name + '_' + name) == dgn) {
              Object.values(dgs).forEach((v: Record<string, any>)=>{if (v.display_name==critn) {odg=v;}});
            }
          
        })
  
      });  
    }
    
    return odg;  

  }
}



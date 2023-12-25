import {Point} from '$lib/geometry';
import {parse_dict, sum} from '$lib/arrays';


export class Measurement{
    constructor(
      readonly value: number[],
      readonly expected: number,
      readonly direction: Point[],
      readonly visibility: number[]
    ) {}
  
    static parse(data: Record<string, any> ) {
      return new Measurement(
        data.value,
        data.expected,
        Object.values(data.direction).map(p => new Point(p.x, p.y, p.z)),
        data.visibility
    )}
  
  }
  
  
  export class Result{
    constructor (
      readonly name: string, 
      readonly measurement: Measurement | number[],
      readonly sample: number[],
      readonly errors: number[],
      readonly dgs: number[],
      readonly keys: string[] | number[],
      readonly total: number
    ) {}
    static parse(data: Record<string, any>) {
      let m: Measurement | number[];
      if (typeof data.measurement === 'undefined') {
        m=[];
      } else {
        if (data.measurement.constructor == Object) {m=Measurement.parse(data.measurement);} else {m=data.measurement;}
      }
      return new Result(data.name, m, data.sample, data.errors, data.dgs, data.keys, data.total);
    }
  
    factoredDG(difficulty: (v: number)=>number) {
      if (this.dgs.length == 0) {return 0;}
      return sum(this.dgs.map(v=>difficulty(v)));
    }
  
  }
  
  
  export class Results{
    constructor(
      readonly name: string, 
      readonly data: Record<string, Result>, 
      readonly summary: Record< string, number[]>,
      readonly total: number
    ) {}
  
    static parse(data: Record<string, any>) {
      return new Results(
        data.name, 
        parse_dict(data.data, Result.parse),
        data.summary,
        data.total
      )
    }
  
    factoredDG(difficulty: (v: number)=>number) {
      if (Object.values(this.data).length == 0) {return 0;}
      return sum(Object.values(this.data).map(v=>v.factoredDG(difficulty)));
    }
  }
  
  export class ElementsResults{
    constructor(
      readonly data: Record<string, Results>, 
      readonly summary: Record< string, number[]>,
      readonly total: number
    ) {}
  
    static parse(data: Record<string, any>) {return new ElementsResults(
      parse_dict(data.data, Results.parse),
      data.summary,
      data.total
    )}
  
    all_fields() {
      const af: string[] = [];
      $: Object.values(this.data).forEach((results) => {
        Object.values(results.data).forEach(result => {
          af.push(result.name);
        });
      });
      return Array.from(new Set(af));
    }
  
    get_downgrades(field='Total') {
      const scores: Record<string, number> = {};
      Object.entries(this.data).forEach(([k, v]) => {
        if (field == 'Total') {
          scores[k] = v.total;
        } else if (field in v.data) {
          scores[k] = v.data[field].total;
        } else {
          scores[k] = 0;
        } 
      })
      
      return scores
    }
  
    check_field(field='Total') {
      const scores: Record<string, boolean> = {};
      Object.entries(this.data).forEach(([k, v]) => {
        if (field == 'Total') {
          scores[k] = true;
        } else if (field in v.data) {
          scores[k] = true;
        } else {
          scores[k] = false;
        } 
      })
      
      return scores
    }
  
    summaries() {
      const summaries: Record<string, Record<string, number|null>> = {};
      const allfields: string[] = this.all_fields();
  
      Object.entries(this.data).forEach(([k, v]) => {
        summaries[k] = {}
        allfields.forEach(f => {
          if (f in v.data) {summaries[k][f] = v.data[f].total;} else {summaries[k][f] = null;}
        });
        summaries[k]['Total'] = v.total;
      })
      return summaries;
    }
  
    factoredDG(difficulty: (v: number)=>number) {
      return sum(Object.values(this.data).map(v=>v.factoredDG(difficulty)));
    }
  
  }
  
  
  
  export class ManoeuvreResult{
    constructor (
      readonly inter: Results,
      readonly intra: ElementsResults,
      readonly positioning: Results,
      readonly summary: Record<string, number>,
      readonly score: number
    ) {}
    static parse(data: Record<string, any>) {return new ManoeuvreResult(
      Results.parse(data.inter),
      ElementsResults.parse(data.intra),
      Results.parse(data.positioning),
      data.summary,
      data.score
    )}
  }
  
  
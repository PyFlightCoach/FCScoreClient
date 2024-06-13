import { writable, type Writable } from 'svelte/store';
import {server_version, run_manoeuvre } from '$lib/api_calls';
import {FCJParams, FCJson} from '$lib/fcjson';
import type{ Man, Internals } from '$lib/api_objects/mandata';
import pkg from 'file-saver';


const PUBLIC_VERSION = 'static_trial'
const { saveAs } = pkg;


class FlightData {
  fcj: Writable<FCJson|null> = writable(null);
  direction: Writable<number|null> = writable(null);
  mannames: Writable<string[]> = writable([]);
  mans: Record<string, Writable<Man>> = {};
  

  get_value (name: string) {
    let outv: any;
    this[name].subscribe(v => {outv=v})();
    return outv
  }

  set_value (name: string, value: any) {
    this[name].set(value);
  }

  addMan(name: string, man: Man): Writable<Man> {
    this.mans[name] = writable(man);
    this.mannames.update(v=>[...v, name]);
    if (Object.keys(this.mans).length == 1) {this.direction.set(man.direction);}
    return this.mans[name];
  };

  clear() {
    this.mans = {};
    this.mannames.set([]);
    this.direction.set(null);
    this.fcj.set(null);
  };

  async analyseManoeuvre(name: string, force: boolean = false, optim: boolean | null=null, internals=false) {
    if (optim === null) {
      optimise.subscribe(v=>{optim=v})();
    }
    let rman = this.mans[name];
    const fcj = this.get_value('fcj');

    async function score(man: Man) {
      if (man.scores === null || force) {
        return await run_manoeuvre(man, fcj, optim, internals);
      } else {
        man.busy = false;
        return man;
      }
    }

    let man: Man;
    rman.subscribe((val) => { man = val })();
    if (!man.busy) {
      rman.update(v=>{v.busy=true; return v})
      score(man).then(res=>{rman.set(res)})
    }
        
  }

  async analyseList(names: string[], force=false, optim=null, internals=false) {
    names.forEach(async name => {
      await this.analyseManoeuvre(name, force, optim, internals);
    })
  }

  async export() {
    let name: string = this.get_value('name');
            
    let expd: Record<string, any> = {
      name,
      client_version: PUBLIC_VERSION,
      server_version: await server_version(),
      sinfo: this.get_value('sinfo'),
      parameters: this.parameters,
      data: {}
    };

    Object.values(this.mans).forEach((man: Writable<Man>, i: Number) => {
      man.subscribe((val) => {
        expd.data[val.name] = {
          name: val.name,
          id: val.id,
          direction: val.direction,
          scores: val.scores,
          els: val.els,
          data: val.data
        };
      });
    });

    var fileToSave = new Blob(
      [JSON.stringify(expd)], 
      {type: 'application/json'}
    );   

    saveAs(fileToSave, name + '_analysis.json');
  }

  manScore(name: string) {
    let man: Record<string, any> = {};
    this.mans[name].subscribe((val) => { man = val })();
    if ('score' in man) {
      return man.scores.k * man.scores.total;
    } else {
      return 0;
    }
  }

  totalScore(mannames: Record<string, any>) {
    
    let total = 0;
    Object.values(this.mans).forEach(man => {
      man.subscribe((val) => { total += val.scores===null ? 0 : val.scores.total })();
    })
    return total
  }
}

export const flightdata = new FlightData();
export const schedule = new FlightData();
export const mouse = writable({ x: 0, y: 0 });

export const server = writable('http://localhost:8000');


export class NavContent {
  name: string;
  href: string='';
  onclick: () => void = () => { };
  constructor(name: string, href: string, onclick = () => {}) {
    this.name = name;
    this.href = href;
    this.onclick = onclick;
  }

}
export const navitems: Writable<NavContent[]> = writable([]);
export const optimise: Writable<boolean> = writable(false);
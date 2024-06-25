import { writable, type Writable} from 'svelte/store';
import {run_manoeuvre, server_version } from '$lib/api_calls';
import { FCJManResult, FCJson, FCSResult} from '$lib/fcjson';
import{ ElSplit, Scores, type Man } from '$lib/api_objects/mandata';
import pkg from 'file-saver';
import { browser } from "$app/environment"

const { saveAs } = pkg;

export function get_value (store: Writable<any>): any {
  let outv: any;
  store.subscribe(v => {outv=v})();
  return outv;
}

class FlightData {
  fcj: Writable<FCJson|null> = writable(null);
  direction: Writable<number> = writable(0);
  mannames: Writable<Record<string, number>> = writable({});
  mans: Record<string, Writable<Man>> = {};
  
  addMan(name: string, man: Man): Writable<Man> {
    this.mans[name] = writable(man);
    this.mannames.update((v)=>{v[name]=0; return v;});
    return this.mans[name];
  };

  clear() {
    this.mans = {};
    this.mannames.set({});
    this.direction.set(0);
    this.fcj.set(null);
  };

  async analyseManoeuvre(name: string, force: boolean = false, optim: boolean | null=null, internals=false) {
    const fcj = get_value(this.fcj);
    const _direction = get_value(this.direction);
    
    async function score(man: Man) {
      if (man.scores === null || force) {
        return await run_manoeuvre(
          man, fcj, _direction,
          optim===null? get_value(optimise): optim, 
          internals
        );
      } else {
        man.busy = false;
        return man;
      }
    }

    if (!get_value(this.mans[name]).busy) {
      this.mans[name].update(v=>{v.busy=true; return v});
      score(get_value(this.mans[name])).then(res=>{
        this.mans[name].set(res)
        this.mannames.update((v)=>{
          let score = get_value(this.mans[name]).get_first_matching_score({difficulty:3, truncate:false})
          v[name] = score? score.total * score.k: 0; 
          return v;
        })
      });
    }
    return get_value(this.mans[name]);
  }

  async analyseList(names: string[], force=false, optim: boolean|null=null, internals: boolean=false) {
    
    this.mannames.update((v)=>{
      names.forEach(n=>v[n]=0);
      return v;
    });
    names.forEach(async name => {
      await this.analyseManoeuvre(name, force, optim, internals);
    })
  }

  async export() {
    let fcs_results = [new FCJManResult(
      new Scores(0, 0, 0, 10, 0),
      []
    )]
    Object.values(this.mans).forEach((_man: Writable<Man>)=>{
      const man: Man = get_value(_man);
      if (man.scores===null || man.els===null) {
        throw new Error(`Manoeuvre ${man.name} not scored`);
      } else {
        fcs_results.push(new FCJManResult(
          man.scores,
          man.els
        ))
      }
    });
    const mannames: Record<string, number>  = get_value(this.mannames);
    const results = new FCSResult(  
      await server_version(),
      new Date().toLocaleString(), 3, false, fcs_results, 
      Object.values(mannames).reduce((a, b) => a + b, 0)
    )

    
    const fcj = get_value(this.fcj);
    saveAs(
      new Blob([JSON.stringify(fcj.add_result(results))], 
      {type: 'application/json'}), 
      fcj.name
    );
    

  }

}

export const flightdata = new FlightData();
export const schedule = new FlightData();
export const mouse = writable({ x: 0, y: 0 });


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


export const server = writable(browser && localStorage.getItem('server') || 'http://localhost:5000');
server.subscribe((value) => {if (browser) {localStorage.setItem('server', value)}});

export const optimise = writable<boolean>(browser ? localStorage.getItem('optimise') === 'true' : true);
optimise.subscribe((value) => {if (browser) {localStorage.optimise = String(value)}})

export const difficulty = writable<number>(browser ? parseInt(localStorage.getItem('difficulty')!) : 3);
difficulty.subscribe((value) => {if (browser) {localStorage.difficulty = String(value)}})
  
export const truncate = writable<boolean>(browser ? localStorage.getItem('truncate') === 'true' : false);
truncate.subscribe((value) => {if (browser) {localStorage.truncate = String(value)}})
  

export const mname: Writable<string> = writable('');
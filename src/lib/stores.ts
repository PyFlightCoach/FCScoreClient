import { writable, type Writable} from 'svelte/store';
import {run_manoeuvre } from '$lib/api_calls';
import { FCJson} from '$lib/fcjson';
import type{ Man } from '$lib/api_objects/mandata';
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
    this.fcj.set(null);
  };

  async analyseManoeuvre(name: string, force: boolean = false, optim: boolean | null=null, internals=false) {
    const fcj = get_value(this.fcj);

    async function score(man: Man) {
      if (man.scores === null || force) {
        return await run_manoeuvre(
          man, fcj, 
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
        this.mannames.update((v)=>{v[name] = res.scores? res.scores.total * res.scores.k: 0; return v})
        this.mans[name].set(res)
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


export const mname: Writable<string> = writable('');
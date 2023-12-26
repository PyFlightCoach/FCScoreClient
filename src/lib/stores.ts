import { writable, type Writable } from 'svelte/store';
import { align, score, create_fc_json, server_version } from '$lib/api_calls';
import type {State} from '$lib/geometry';
import type { ManDef } from '$lib/api_objects/mandef';
import {type ReadMan, AlignedMan, ScoredMan} from '$lib/api_objects/mandata';
import pkg from 'file-saver';
import {PUBLIC_VERSION} from '$env/static/public';

const { saveAs } = pkg;
export const PlotlyLib = writable(null);


class FlightData {
  name: Writable<string|null> = writable(null);
  sinfo: Writable<Record<string, string|null>> = writable({
    category: null, name: null
  });
  direction: Writable<number> = writable(0);
  mans: Record<string, Writable<ReadMan | AlignedMan | ScoredMan>> = {};
  mannames: Writable<Record<string, number>> = writable({});
  
  addMan(name: string, man: ReadMan | ScoredMan | AlignedMan): Writable<ReadMan|AlignedMan|ScoredMan> {
    this.mans[name] = writable(man);
    this.mannames.update((mnames) => {
      mnames[name] = 1;
      return mnames;
    });
    if (Object.keys(this.mans).length == 1) {
      const st = 'fl' in man ? man.fl : man.al;
      this.direction.set(st.data[0].direction());
    }
    return this.mans[name];
  };

  clear() {
    this.mans = {};
    this.mannames.set({});
    this.name.set(null);
    this.sinfo.set({category: null, name: null});
    this.direction.set(0);
  }


  async alignman(name: string) {
    let rman = this.mans[name];
    let man: ReadMan;
    rman.subscribe((val) => { man = val })();
    
    if (('fl' in man) && !man.busy) {
      rman.update(man => { man.busy = true; return man; });
      try {

        await align(man.mdef, man.fl.data).then(res => {
          rman.set(AlignedMan.partial_parse(man, res));
          this.mannames.update(mnames => { mnames[name] = 2; return mnames; })
        });
        
      } catch (err) {
        console.log('Aligment error, man=' + name + ', ' + err);
        rman.update(man => {man.busy = false; return man;});
      }
    }
  }

  async alignlist(names: string[]) {
    for (let i=0; i<names.length; i++) {
      await this.alignman(names[i]);
    }
  }

  async scoreman(name: string) {
    let rman = this.mans[name];
    let man: AlignedMan | ReadMan | ScoredMan;
    rman.subscribe((val) => { man = val })();
    
    let direction: number=0;
    this.direction.subscribe(di=>{direction=di})();

    if ((man instanceof AlignedMan) && !man.busy) {
      rman.update(man => { man.busy = true; return man; });
      try {
        
        await score(man.mdef, man.al.data, direction).then(res => {
          rman.set(ScoredMan.partial_parse(man, res));
          this.mannames.update((mnames) => { mnames[name] = 3; return mnames; });
        });
   
      } catch (err) {

        console.log('Scoring error, man=' + name + ', ' + err);
        rman.update(man => {man.busy = false; return man; });

      }
    }
  }

  async scorelist(names: string[]) {
    for (let i=0; i<names.length; i++) {
      await this.alignman(names[i]);
      await this.scoreman(names[i]);
    }
  }

  async downloadTemplate (kind: string) {
    let sts: State[] = [];
    let mdefs: ManDef[] =[];
    let mannames: Record<string, any>;

    this.mannames.subscribe(mn => {mannames = mn})();

    Object.keys(mannames).forEach(mn => {
    flightdata.mans[mn].subscribe(man=>{
      if (kind=='intended') {
      sts = sts.concat(man.intended_template);
      } else {
      sts = sts.concat(man.corrected_template);
      }
      
      mdefs.push(man.mdef);
    })();
    });
    let fcj = await create_fc_json(sts, mdefs, 'kind', 'F3A');
    var fileToSave = new Blob(
      [JSON.stringify(fcj)], 
      {type: 'application/json'}
    );

    saveAs(fileToSave, kind + '_template.json');
  }
  
  get_value (name: string) {
    let outv: any;
    this[name].subscribe(v => {outv=v})();
    return outv
  }

  set_value (name: string, value: any) {
    this[name].set(value);
  }

  async export() {
    let name: string = this.get_value('name');
    let mnames: Record<string, any> = this.get_value('mannames');
        
    let expd: Record<string, any> = {
      name,
      client_version: PUBLIC_VERSION,
      server_version: await server_version(),
      sinfo: this.get_value('sinfo'),
      score: this.totalScore(mnames),
      manscores: Object.fromEntries(Object.keys(this.mans).map((mn)=>{
        return [mn, this.manScore(mn)]
      })),
      data: {}
    };

    Object.values(this.mans).forEach((man: Writable<Record<string, any>>) => {
      man.subscribe((val) => {
        expd.data[val.mdef.info.short_name] = val;
      });
    });

    var fileToSave = new Blob(
      [JSON.stringify(expd)], 
      {type: 'application/json'}
    );   

    saveAs(fileToSave, name + '_analysis.json');
  }

  import (data: Record<string, any>) {
    this.name.set(data.name);
    this.sinfo.set(data.sinfo);
    Object.entries(data.data).forEach((man)=>{
      this.addMan(man[0], ScoredMan.parse(man[1]));
    });

  }

  manScore(mname :string) {
    let man: Record<string, any> = {};
    this.mans[mname].subscribe((val) => { man = val })();
    if ('score' in man) {
      return man.mdef.info.k * man.score.score;
    } else {
      return 0;
    }
  }

  totalScore(mannames: Record<string, any>) {
    
    let total = 0;
    Object.keys(mannames).forEach(mn => {
      total+=this.manScore(mn);
    })
    return total
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

import type {OBJ} from '$lib/plots/traces';
export const colddraft: Writable<OBJ|null> = writable(null);
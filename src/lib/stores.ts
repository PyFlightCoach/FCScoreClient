import { writable, readable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { align, score, create_fc_json } from '$lib/api_calls';
import type {State} from '$lib/geometry';
import type { ManDef } from '$lib/api_objects';
import { saveAs } from 'file-saver';
export const PlotlyLib = writable(null);

class FlightData {
    name: Writable<string|null> = writable(null);
    sinfo: Writable<Record<string, string|null>> = writable({
        category: null, name: null
    });
    direction: Writable<number> = writable(0);
    mans: Record<string, Writable<Record<string, any>>> = {};
    mannames: Writable<Record<string, number>> = writable({});
    
    addMan(name: string): Writable<Record<string, any>> {
        this.mans[name] = writable({});
        this.mannames.update((mnames) => {
            mnames[name] = 1;
            return mnames;
        });

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
        let man: Record<string, any> = {};
        const uns = rman.subscribe((val) => { man = val });
        if (('fl' in man) && !man.busy) {
            rman.update(man => { man.busy = true; return man; });
            try {
                const res: Record<string, any> = await align(man.mdef, man.fl);
                rman.update((data: Record<string, any>) => {
                    data.dist = res.dist
                    data.status = 'aligned, dist='+data.dist.toFixed(1)
                    data.al = res.al;
                    delete data.fl;
                    data.busy = false;
                    return data;
                });
                this.mannames.update(
                    (mnames) => { mnames[name] = 2; return mnames; }
                );
            } catch (err) {
                console.log('Aligment error, man=' + name + ', ' + err);
                rman.update(man => {
                    man.status = 'Aligment error = ' + err;
                    man.busy = false; 
                    return man; 
                });
            }

        }
        uns();
    }

    async alignlist(names: string[]) {
        for (let i=0; i<names.length; i++) {
            await this.alignman(names[i]);
        }
    }

    async scoreman(name: string) {
        let rman = this.mans[name];
        let man: Record<string, any> = {};
        rman.subscribe((val) => { man = val })();
        
        let direction: number;
        this.direction.subscribe(di=>{direction=di})();

        if (!('score' in man) && !man.busy) {
            rman.update(man => { man.busy = true; return man; });

            try {
                const res: Record<string, any> = await score(man.mdef, man.al, direction);
                rman.update((data: Record<string, any>) => {
    
                    data = { ...data, ...res, busy: false };
                    return data;
                });
                this.mannames.update(
                    (mnames) => { mnames[name] = 3; return mnames; }
                );
            } catch (err) {
                rman.update(man => {
                    man.status = 'Scoring error = ' + err;
                    man.busy = false; 
                    return man; 
                });
            }
        }
    }

    async scorelist(names: string[]) {
        await this.alignlist(names);
        for (let i=0; i<names.length; i++) {
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
    
    export(): Record<string, any> {
        // export the stored manoeuvre analysis, might be useful one day
        let expd: Record<string, any> = {};

        Object.values(this.mans).forEach((man: Writable<Record<string, any>>) => {
            man.subscribe((val) => {
                expd[val.mdef.info.short_name] = val;
            });
        });
        return expd;
    }


    manScore(mname :string) {
        let man: Record<string, any> = {};
        this.mans[mname].subscribe((val) => { man = val })();
        if ('score' in man) {
            return man.mdef.info.k * man.score.score;
        } else {
            return 0;
        }
          // TODO this falls over when manoeuvre has not been run
        
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
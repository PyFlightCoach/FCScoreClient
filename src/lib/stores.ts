import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const PlotlyLib = writable(null);
import { align, score, example } from '$lib/api_calls';


class FlightData {
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
    
    man(name: string): Writable<Record<string, any>> {
        let mname = name;
        if (name.includes('example')) {
            mname = name.split('_')[0];
            if (!(mname in this.mans)) {
                this.mannames.update(mnames => {mnames[mname]=1; return mnames});
                this.mans[mname] = writable({});
                example(mname).then(man => {this.mans[mname].set(man)});
        }}
        return this.mans[mname];
    }

    clear() {
        this.mans = {};
        this.mannames.set({});
    }

    async alignman(name: string) {
        let rman = this.man(name);
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

    async scoreman(name: string) {
        let rman = await this.man(name);
        let man: Record<string, any> = {};
        const uns = rman.subscribe((val) => { man = val });

        if (!('score' in man) && !man.busy) {
            rman.update(man => { man.busy = true; return man; });

            try {
                const res: Record<string, any> = await score(man.mdef, man.al);
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
        uns();
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






}


export const flightdata = new FlightData();



export const mouse = writable({ x: 0, y: 0 });


export const flightmenu: Writable<Record<string, any>> = writable({});
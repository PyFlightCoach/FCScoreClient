import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const PlotlyLib = writable(null);
import { align, score, example } from '$lib/api_calls';

import { createEventDispatcher } from 'svelte';


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
        let rman = await this.man(name);
        let man: Record<string, any> = {};
        const uns = rman.subscribe((val) => { man = val });

        if (('fl' in man) && !man.busy) {
            rman.update(man => { man.busy = true; return man; });
            const res: Record<string, any> = await align(man.mdef, man.fl);
            rman.update((data: Record<string, any>) => {
                data.al = res;
                delete data.fl;
                data.busy = false;
                return data;
            });
            this.mannames.update(
                (mnames) => { mnames[name] = 2; return mnames; }
            );
        }
        uns();
    }

    async scoreman(name: string) {
        let rman = await this.man(name);
        let man: Record<string, any> = {};
        const uns = rman.subscribe((val) => { man = val });

        if (!('score' in man) && !man.busy) {
            rman.update(man => { man.busy = true; return man; });
            const res: Record<string, any> = await score(man.mdef, man.al);
            rman.update((data: Record<string, any>) => {

                data = { ...data, ...res, busy: false };
                return data;
            });
            this.mannames.update(
                (mnames) => { mnames[name] = 3; return mnames; }
            );
        }
        uns();
    }
    

    export(): Record<string, any> {
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
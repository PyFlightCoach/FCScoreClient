import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const PlotlyLib = writable(null);
import { align, score } from '$lib/api_calls';

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
        return this.mans[name];
    }

    clear() {
        this.mans = {};
        this.mannames.set({});
    }

    async alignman(name: string) {
        let man: Record<string, any> = {};
        this.mans[name].subscribe((val) => { man = val });

        if (('fl' in man) && !man.busy) {
            this.mans[name].update(man => { man.busy = true; return man; });
            const res: Record<string, any> = await align(man.mdef, man.fl);
            this.mans[name].update((data: Record<string, any>) => {
                data.al = res;
                delete data.fl;
                data.busy = false;
                return data;
            });
            this.mannames.update(
                (mnames) => { mnames[name] = 2; return mnames; }
            );
        }

    }

    async scoreman(name: string) {
        let man: Record<string, any> = {};
        this.mans[name].subscribe((val) => { man = val });

        if (!('score' in man) && !man.busy) {
            this.mans[name].update(man => { man.busy = true; return man; });
            const res: Record<string, any> = await score(man.mdef, man.al);
            this.mans[name].update((data: Record<string, any>) => {

                data = { ...data, ...res, busy: false };
                return data;
            });
            this.mannames.update(
                (mnames) => { mnames[name] = 3; return mnames; }
            );
        }

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
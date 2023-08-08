import { writable } from 'svelte/store';
import type { Writable} from 'svelte/store';

export const PlotlyLib = writable(null);
import {align, score} from '$lib/api_calls';

class FlightData {
    mans: Record<string, Writable<Record<string, any>>> = {};
    mannames: Writable<string[]> = writable([]);

    addMan(name: string): Writable<Record<string, any>> {
        this.mans[name] = writable({}); 
        this.mannames.update((mnames) => {
            mnames.push(name);
            return mnames;
        });
        return this.mans[name];
    };

    man(name:string): Writable<Record<string, any>> {
        return this.mans[name];
    }

    clear() {
        this.mans = {}; 
        this.mannames.update((val) => []);
    }

    alignman(name: string) {
        this.mans[name].update((man)=>{
            if (('fl' in man) && !man.busy) {
                man.busy = true;

                align(man.mdef, man.fl)
                .then((res: Record<string, any>) => {
                    this.mans[name].update((data: Record<string, any>) => {
                        data.al = res;
                        delete data.fl;
                        data.busy = false;
                        return data;
                    });
                });

            }
            return man;
        });
    }

    scoreman(name: string) {
        this.mans[name].update((man) => {
            if (!('score' in man) && !man.busy) {
                man.busy = true;
                score(man.mdef, man.al)
                .then((res: Record<string, any>) => {
                    this.mans[name].update((data: Record<string, any>) => {
                        data.analysis = res.analysis;
                        data.score=res.score;
                        data.busy = false;
                        return data;
                    });
                });
                

            }
            return man
        });
    }

}


export const flightdata=new FlightData();



export const mouse = writable({x: 0, y: 0});


export const flightmenu: Writable<Record<string, any>> = writable({});
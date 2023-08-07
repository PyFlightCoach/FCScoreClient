import { writable } from 'svelte/store';
import type { Writable} from 'svelte/store';

export const PlotlyLib = writable(null);

function createFlightData(){
    let mans: Record<string, Writable<Record<string, any>>> = {};
    let mannames: Writable<string[]> = writable([]);
    return {
        mannames: mannames,
        addMan: (name: string) => {

            mans[name] = writable({}); 
            mannames.update((mnames) => {
                mnames.push(name);
                return mnames;
            });
            return mans[name];
        },
        man: (name: string) => {           
            return mans[name]
        },
        clear: () => {mans = {};},

    };

};

export const flightdata=createFlightData();

export const mouse = writable({x: 0, y: 0});
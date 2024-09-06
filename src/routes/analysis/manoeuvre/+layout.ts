
import { fcj, activeManoeuvre, internals } from '$lib/stores';
import { analyseManoeuvre } from '$lib/analysis';
import {get} from 'svelte/store';

export async function load() {
  let name = get(activeManoeuvre);
  if (name) {
    let manid = get(fcj)!.unique_names.indexOf(name);
    if (manid) {
      if (!get(internals)![manid]) {
        await analyseManoeuvre(name, true, false, true);
      }
    }
  }
}
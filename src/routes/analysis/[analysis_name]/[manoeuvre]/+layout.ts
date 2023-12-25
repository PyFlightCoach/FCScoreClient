
import { flightdata } from '$lib/stores';
import { ScoredMan } from '$lib/api_objects/mandata';


export async function load({fetch, params}) {
  
  let mname = params.manoeuvre;
  
  if (mname.split("_")[0] == 'example') {
    mname = mname.split("_")[1];

    if (! (mname in flightdata.mans)) {
      const res = await (await fetch('/' + mname + '.json')).json();
      flightdata.addMan(mname, ScoredMan.parse(res));
    }    
  }
  
  return {mname}
}
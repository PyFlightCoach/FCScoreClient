
import { flightdata, mname, get_value } from '$lib/stores';

export async function load({url}) {
  
  let name = get_value(mname);
  console.log(name);  
  if (Object.keys(flightdata.mans).includes(name)) { 
    if (get_value(flightdata.mans[name]).internals===null) {
      await flightdata.analyseManoeuvre(name, true, false, true);
    }
  }
  
}
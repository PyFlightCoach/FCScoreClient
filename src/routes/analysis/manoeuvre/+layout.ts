
import { redirect } from '@sveltejs/kit';
import {base} from '$app/paths';
import { flightdata } from '$lib/stores';
import {Man} from '$lib/api_objects/mandata';

export async function load({url}) {
  
  console.log(url)
  
  let mname = url.searchParams.get('man');
  if (mname == null) {
    redirect(200,base + '/analysis');
  } else {
    let man: Man;
    flightdata.mans[mname].subscribe(v=>{
      man=v;
    });
    if (man.internals===null) {
      flightdata.analyseManoeuvre(mname, true, false, true);
    }
  }
   
  return {mname}
}

import { flightdata } from '$lib/stores';
import { ScoredMan } from '$lib/api_objects/mandata';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { redirect } from '@sveltejs/kit';


export async function load({url}) {
  
  console.log(url)
  
  let mname = url.searchParams.get('man');
  if (mname == null) {
    redirect(200,'/analysis');
  }
  if (mname.split("_")[0] == 'example') {
    mname = mname.split("_")[1];

    if (! (mname in flightdata.mans)) {
      const res = await (await fetch('/' + mname + '.json')).json();
      flightdata.addMan(mname, ScoredMan.parse(res));
    }    
  }  

  
  
  return {mname}
}
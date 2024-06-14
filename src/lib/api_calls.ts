import type {ManDef} from '$lib/api_objects/mandef';
import { Man, Internals } from '$lib/api_objects/mandata';
import type {State} from '$lib/geometry';
import {server} from '$lib/stores';
import type { FCJson} from './fcjson';
import { data } from 'autoprefixer';

async function server_func(func_name: string, kwargs: Record<string, any>={}, method: string='POST') {
  
  let msg = {
    method, 
    headers: {"Content-Type": "application/json"},
    mode: "cors", 
  }
  if (method==='POST') {
    msg.body = JSON.stringify(kwargs);
  }
  let spath: string = '';
  server.subscribe(v=>{spath=v});
  const response = await fetch(`${spath}/${func_name}` , msg);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.log(data);
    return {};
  }
  
}


export async function run_manoeuvre(man: Man, fcj: FCJson, optimise: boolean, long_output: boolean) {

  if (man.internals === null) {
    return man.update(await server_func(
      'run_short_manoeuvre', 
      {
        id: man.id,
        direction: fcj.direction,
        sinfo: fcj.sinfo,
        origin: fcj.origin,
        data: fcj.get_mandata(man.id+1),
        optimise_alignment: optimise,
        long_output: long_output
      }
    ));
  } else {
    return man.update(await server_func(
      'run_long_manoeuvre', 
      {
        mdef: man.internals.mdef,
        direction: fcj.direction,
        id: man.id,
        flown: man.internals.flown.data,
        optimise_alignment: optimise
      }
    ));
  }
}

export async function create_fc_json(sts: State[], mdefs: ManDef[], name: string, category: string) {
  return await server_func('create_fc_json', {sts, mdefs, name, category});
}

export async function server_version(){
  return await server_func('version', {}, 'GET');
}

export async function get_telemetry() {
  return await server_func('telemetry');
}
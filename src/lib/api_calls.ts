import { Man } from '$lib/api_objects/mandata';
import {server, get_value, difficulty, truncate} from '$lib/stores';
import type { FCJData, FCJson, Origin} from './fcjson';

async function server_func(func_name: string, kwargs: Record<string, any>={}, method: string='POST') {
  
  let msg = {
    method, 
    headers: {"Content-Type": "application/json"},
    mode: "cors", 
  }
  if (method==='POST') {
    msg.body = JSON.stringify(kwargs);
  }
  let spath: string = get_value(server);

  const response = await fetch(`${spath}/${func_name}` , msg);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.log(data);
    return {};
  }
  
}


export async function run_manoeuvre(man: Man, fcj: FCJson, direction: number, optimise: boolean, long_output: boolean) {
  try {
    let props: Record<string, any> = {
      id: man.id,
      direction,
      optimise_alignment: optimise,
      long_output: long_output,
      difficulty: 'all',
      truncate: 'both'
    };
    
    if (man.internals === null) {
      props.sinfo = fcj.sinfo,
      props.site = fcj.origin,
      props.data = fcj.get_mandata(man.id+1),
      props.long_output = long_output
      if (man.els !== null) {
        props.els = man.els;
      }
    } else {
      props.mdef = man.internals.mdef,
      props.flown = man.internals.flown.data      
    }

    return man.update(await server_func(
      man.internals === null ? 'run_short_manoeuvre': 'run_long_manoeuvre', 
      props
    ));
  } catch(err) {
    console.log('Error running manoeuvre ' + man.name + ': ' + err.message);
    return man.update({})
  }
  
}

export async function calculate_direction(heading: number, data: FCJData){
    return await server_func('calculate_direction', {heading, data}, 'POST');
}


export async function server_version(){
  try {
    return await server_func('version', {}, 'GET');
  } catch(err) {
    return err.message;
  } 
}

export async function library_versions() {
  try {
    return await server_func('library_versions', {}, 'GET');
  } catch(err) {
    return {};
  } 
}

export async function get_telemetry(): Promise<Blob> {
  
  let spath: string = '';
  server.subscribe(v=>{spath=v});
  return fetch(
    `${spath}/telemetry` , 
    { method: 'get', mode: 'cors' }
  ).then(res => res.blob())
  
}
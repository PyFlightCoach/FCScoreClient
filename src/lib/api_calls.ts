import { Man } from '$lib/api_objects/mandata';
import {server, difficulty, truncate} from '$lib/stores';
import {get} from 'svelte/store';
import type { FCJData, FCJson, Origin} from './api_objects/fcjson';

export async function serverFunc(func_name: string, kwargs: Record<string, any>={}, method: string='POST') {
  
  let msg = {
    method, 
    headers: {"Content-Type": "application/json"},
    mode: "cors", 
  }
  if (method==='POST') {
    msg.body = JSON.stringify(kwargs);
  }
  let spath: string = get(server);

  const response = await fetch(`${spath}/${func_name}` , msg);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.log(data);
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
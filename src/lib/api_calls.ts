import {server} from '$lib/stores';
import {get} from 'svelte/store';

export async function serverFunc(func_name: string, kwargs: Record<string, any>={}, method: string='POST') {
  
  let msg: Record<string, any> = {
    method, 
    headers: {"Content-Type": "application/json"},
    mode: "cors", 
    signal: AbortSignal.timeout(600000)
  }
  if (method==='POST') {
    msg.body = JSON.stringify(kwargs);
  }
  let spath: string = get(server);


  const response = await fetch(`${spath}/${func_name}` , msg);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`${response.statusText}: ${(await response.json()).detail}`) ;
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
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
    response.json().then((res) => {
      throw new Error(`${response.statusText}: ${res.detail}`) ;
    });
    
  }
  
}



export async function get_telemetry() {
  return await serverFunc(`telemetry` , {}, 'GET')
  
}


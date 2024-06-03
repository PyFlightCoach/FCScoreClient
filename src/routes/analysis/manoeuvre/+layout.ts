
import { redirect } from '@sveltejs/kit';
import {base} from '$app/paths';

export async function load({url}) {
  
  console.log(url)
  
  let mname = url.searchParams.get('man');
  if (mname == null) {
    redirect(200,base + '/analysis');
  }
   
  return {mname}
}
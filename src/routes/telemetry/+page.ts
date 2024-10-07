import { serverFunc } from '$lib/api_calls.js';
import pkg from 'file-saver';
const { saveAs } = pkg;

export async function load() {
  return {...(await serverFunc(`telemetry` , {}, 'GET'))}
}



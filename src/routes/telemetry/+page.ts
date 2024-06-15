import { get_telemetry } from '$lib/api_calls.js';
import pkg from 'file-saver';
const { saveAs } = pkg;

export async function load() {
  saveAs(await get_telemetry(), 'telemetry.log');
}



import { writable, type Writable, get} from 'svelte/store';
import {serverFunc } from '$lib/api_calls';
import { FCJManResult, FCJson, FCSResult} from '$lib/api_objects/fcjson';
import { Internals } from '$lib/api_objects/mandata';
import pkg from 'file-saver';
import { browser } from "$app/environment"
import _ from 'underscore';
import {goto} from '$app/navigation';
import {base} from '$app/paths';

const { saveAs } = pkg;


export const fcj: Writable<FCJson|undefined> = writable();
export const direction: Writable<number|undefined> = writable();
export const internals: Writable<Internals[]|undefined> = writable();
export const running: Writable<string[]> = writable([]);

export const server_version: Writable<string> = writable('not connected to server');
export const fa_version: Writable<string> = writable('not connected to server');

export const activeResult: Writable<FCSResult | undefined> = writable();
export const activeManoeuvre: Writable<string|undefined> = writable();

export const difficulty: Writable<number> = writable(3);
export const truncate: Writable<boolean> = writable(false);

export const navitems: Writable<NavContent[]> = writable([]);

export const server = writable(browser && localStorage.getItem('server') || 'https://madeupmodels.com:5010');
server.subscribe((value) => {if (browser) {localStorage.setItem('server', value)}});
export const custom_server = writable(browser && localStorage.getItem('custom_server') || 'http://localhost:5000');
custom_server.subscribe((value) => {if (browser) {localStorage.setItem('custom_server', value)}});
export const optimise = writable<boolean>(browser ? localStorage.getItem('optimise') === 'true' : true);
optimise.subscribe((value) => {if (browser) {localStorage.optimise = String(value)}});
export const long_output = writable<boolean>(browser ? localStorage.getItem('long_output') === 'true' : false);
long_output.subscribe((value) => {if (browser) {localStorage.long_output = String(value)}});

export const mouse = writable({ x: 0, y: 0 });

export const getVersion = async () => {
  try {
    fa_version.set(await serverFunc('fa_version', {}, 'GET'));
  } catch(err) {
    fa_version.set(err.message);
  }
  try {
    server_version.set(await serverFunc('version', {}, 'GET'));
  } catch(err) {
    server_version.set(err.message);
  }

};


export function clearFlight(target: string|null=null) {
  internals.set(undefined);
  direction.set(undefined);
  fcj.set(undefined);
  activeResult.set(undefined);
  activeManoeuvre.set(undefined);
  if (browser && target !== null) {
    goto(target || base);
  }
};

export async function analyseManoeuvre(name: string, force: boolean = false, optim: boolean | null=null, long=false) {
    
  const _fcj = get(fcj)!;
  const manid = _fcj!.unique_names.indexOf(name);
  const old_results = _fcj.get_result(get(fa_version))?.manresults[manid];

  if (!get(running).includes(name) && (!old_results || force)) {

    running.update(v=>{v.push(name);return v;})

    const internal_data = get(internals)![manid];

    const props: Record<string, any> = {
      id:manid-1,
      direction:get(direction)!,
      optimise_alignment: optim===null? get(optimise): optim,
      long_output: long || get(long_output),
      difficulty: 'all',
      truncate: 'both'
    };

    if (internal_data) {
      props.mdef = internal_data.mdef;
      props.flown = internal_data.flown.data;
    } else {
      props.sinfo = _fcj!.sinfo;
      props.site = _fcj!.origin;
      props.data = _fcj!.get_mandata(manid);
      if (old_results) {
        props.els = old_results.els;
      }
    }

    try {
      const res = await serverFunc(
        internal_data ? 'run_long_manoeuvre': 'run_short_manoeuvre',
        props
      );
      
      fcj.update(v=>{
        v?.add_result(res.fa_version, name, FCJManResult.parse(res));
        return v;
      });

      if (Object.keys(res).includes('mdef')) {
        internals.update(v=>{v![manid]=Internals.parse(res);return v;});
      }

      activeResult.set(get(fcj)?.get_result(get(fa_version)));
      
    } catch(err) {
      console.log('Error running manoeuvre ' + name + ': ' + err.message);
    }
      
    running.update(v=>v.filter(item => item !== name));
    
  }
}

export async function analyseList(names: string[], force=false, optim: boolean|null=null, internals: boolean=false) {
  
  names.forEach(async name => {
    await analyseManoeuvre(name, force, optim, internals);
  })
}

export async function loadExample() {
  
  fcj.set(FCJson.parse(await (await fetch(`${base}/example/example_p25.json`)).json()));
  direction.set(1);
  const _fcj = get(fcj)!;
  activeResult.set(_fcj.fcs_scores[_fcj.fcs_scores.length-1]);
  internals.set(Array(_fcj.mans.length));
  _fcj.unique_names.forEach((name, i) => {
    Internals.parse_example(name).then((data) => {
      internals.update(v=>{v![i]=data;return v;});
    });
  });

}

export async function exportFCJ() {
  saveAs(
    new Blob([JSON.stringify(get(fcj)!.export_data())], 
    {type: 'application/json'}), 
    get(fcj)!.name
  );
}


export class NavContent {
  constructor(
    readonly name: string,
    readonly  href: string, 
    readonly onclick = () => {}
  ) {}
}


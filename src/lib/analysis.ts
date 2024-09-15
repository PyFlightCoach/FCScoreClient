import {
  createAnalyses,
  analyses,
  manNames,
  running,
  runInfo,
  clearAnalysis,
} from '$lib/stores';
import { MA } from '$lib/api_objects/mandata';
import { serverFunc } from '$lib/api_calls';
import { States } from '$lib/geometry';
import { FCJson, type FCJMan, ScheduleInfo } from '$lib/api_objects/fcjson';
import { get } from 'svelte/store';
import { base } from '$app/paths';
import { fcj } from '$lib/stores';
import { Manoeuvre } from '$lib/api_objects/manoeuvre';

import pkg from 'file-saver';
import { ManDef } from './api_objects/mandef';
import { ManoeuvreResult } from './api_objects/scores';

const { saveAs } = pkg;

export async function analyseMans(ids: number[], optim: boolean, force: boolean) {
  ids.forEach(async (id) => {
    await analyseManoeuvre(id, optim, force);
  });
}

export async function analyseAll(optim: boolean, force: boolean) {
  analyses.forEach(async (ma, i) => {
    await analyseManoeuvre(i, optim, force);
  });
}

export async function analyseManoeuvre(id: number, optimise: boolean, force: boolean) {
  const ma = get(analyses[id]);
  if ((!ma.scores || force) && !get(running[id])) {
    runInfo[id].set(`Running analysis at ${new Date().toLocaleTimeString()}`);
    running[id].set(true);

    await ma.run(optimise).then((res) => {
      analyses[id].set(res);
      running[id].set(false);
    });
    
  }
}

export async function loadExample() {
  clearAnalysis();
  const _fcj = FCJson.parse(await (await fetch(`${base}/example/example_fcjson.json`)).json());
  createAnalyses(_fcj.unique_names.slice(1, _fcj.unique_names.length - 1));
  get(manNames).forEach(async (name, i) => {
    fetch(`${base}/example/${name}.json`).then(async (res) => {
      res.json().then((data) => {
        analyses[i].set(
          new MA(
            name,
            i + 1,
            new ScheduleInfo('f3a', 'p25'),
            'RighttoLeft',
            States.parse(data.flown),
            _fcj.manhistory(i + 1),
            data.k,
            ManDef.parse(data.mdef),
            Manoeuvre.parse(data.manoeuvre),
            States.parse(data.template),
            Manoeuvre.parse(data.corrected),
            States.parse(data.corrected_template),
            ManoeuvreResult.parse(data.full_scores)
          )
        );
      });
    });
  });
}

export async function exportFCJ() {
  saveAs(
    new Blob([JSON.stringify(get(fcj)!.export_data())], { type: 'application/json' }),
    get(fcj)!.name
  );
}

export async function listCategories() {
  return await serverFunc('categories', {}, 'GET');
}

export async function listSchedules(category: string) {
  return (await serverFunc(`${category}/schedules`, {}, 'GET')).schedules;
}

export async function listManoeuvres(category: string, schedule: string) {
  return await serverFunc(`${category}/${schedule}/manoeuvres`, {}, 'GET');
}

export async function parseFCJMans(fcj: FCJson, offset: number) {
  const sdets = await listManoeuvres(
    fcj.sinfo.category.replaceAll(' ', '_'),
    fcj.sinfo.name.replaceAll(' ', '_')
  );

  return fcj.mans.map((man: FCJMan, i: number) => {
    let serverMan;
    switch (i) {
      case 0:
        serverMan = 'Takeoff';
        break;
      case fcj.mans.length - 1:
        serverMan = 'Landing';
        break;
      default:
        serverMan = sdets.manoeuvres[i - 1];
    }
    return {
      category: i == 0 || i == fcj.mans.length - 1 ? undefined : sdets.category,
      schedule: i == 0 || i == fcj.mans.length - 1 ? undefined : sdets.schedule,
      manoeuvre: serverMan,
      id: i,
      stop: man.stop + offset
    };
  });
}


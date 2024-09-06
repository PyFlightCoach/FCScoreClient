import { FCJson, type FCJMan } from '$lib/api_objects/fcjson';

export function parseFCJMans(fcj: FCJson, offset: number) {
	
  return fcj.mans.map((man: FCJMan, i: number) => {
    return {
      category: fcj.sinfo.category,
      schedule: fcj.sinfo.name,
      manoeuvre: man.name,
      stop: man.stop + offset
    };
  });
		
}


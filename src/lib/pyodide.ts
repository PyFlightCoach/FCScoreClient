import { loadPyodide } from "/node_modules/pyodide/pyodide.mjs";


export let apiMethods: Record<string, any>={};
export const pyodide = await loadPyodide({})

await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");

await micropip.install('fcscore');



pyodide.runPython(
  `
  from fcscore.pyodide import *
  `
);
  
apiMethods.convert_fcj = pyodide.globals.get('fcj_to_states');
apiMethods.score_manoeuvre = pyodide.globals.get('score_manoeuvre');
apiMethods.analyse_manoeuvre = pyodide.globals.get('analyse_manoeuvre');


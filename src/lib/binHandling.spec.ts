import BINWorker from '$lib/JsDataflashParser/parser.js?worker';
import {readFileSync} from 'fs';
import {describe, expect, it} from 'vitest';
import '@vitest/web-worker';
import {mergeTimestamps} from './binHandling';
import nj from "numjs"; 

let parsed = false;

const worker = new BINWorker();
let data: Record<string, any> = {};

const buffer = readFileSync('src/lib/test_data/00000048.BIN').buffer;

worker.onmessage = (event) => {
    if (event.data.hasOwnProperty('messageType')) {        
        data[event.data.messageType] = event.data.messageList;
    } else if (event.data.hasOwnProperty('messagesDoneLoading')) {
        parsed=true;
    }
};

worker.postMessage({
    action: 'parse',
    file: buffer,
    msgs: ['POS', 'ATT']
});
function until(conditionFunction) {

const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 400);
}

return new Promise(poll);
}

await until(()=>parsed);

describe("loaded data", () => {
    
    it('does exist', ()=> {
        expect(data).not.toEqual({});
    });

    it('contains some POS messages', ()=> {
        expect(data.POS).toBeDefined();
        expect(Object.keys(data.POS.time_boot_ms).length).toBeGreaterThan(0);
    });



})


describe('some array operations', () => {

    it('adds two arrays', () => {
       let res = nj.array([1,2,3]).add(nj.array([1,2,3]));
        expect(res).toEqual(nj.array([2,4,6]));
    });

});


describe('create a States object from the data', ()=>{



});
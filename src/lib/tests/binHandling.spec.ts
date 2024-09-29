import BINWorker from '$lib/JsDataflashParser/parser.js?worker';
import {readFileSync} from 'fs';
import {describe, expect, it} from 'vitest';
import '@vitest/web-worker';
import { BinData, BinField } from '$lib/bindata';

let parsed = false;

const worker = new BINWorker();
let data: Record<string, any> = {};

const buffer = readFileSync('src/lib/tests/test_data/00000048.BIN').buffer;

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

describe("loading data", () => {
    
    it('does exist', ()=> {
        expect(data).not.toEqual({});
    });

    it('contains some POS messages', ()=> {
        expect(data.POS).toBeDefined();
        expect(Object.keys(data.POS.time_boot_s).length).toBeGreaterThan(0);
    });

})


describe("get integer the location of a value in time_boot_s of a BinField", async () => {
  
  const col = new BinField(data.POS);

  it ('should get closest I' , ()=>{
    const t = 500;
    const i = col.getI(t, 'nearest');
    expect(Math.abs(col.t[i] - t)).toBeLessThan(Math.abs(col.t[i+1] - t));
    expect(Math.abs(col.t[i] - t)).toBeLessThan(Math.abs(col.t[i-1] - t));
  })

  it ('should get the last i' , ()=>{
    const i = col.getI(1e6, 'nearest');
    expect(i).toBe(col.t.length - 1);
  })

  it ('should get the last i exactly' , ()=>{
    const i = col.getI(col.t[col.t.length-1], 'nearest');
    expect(i).toBe(col.t.length - 1);
  })

  it ('should get the first i' , ()=>{
    const i = col.getI(0, 'nearest');
    expect(i).toBe(0);
  })

  it ('should get the first i exactly' , ()=>{
    const i = col.getI(col.t[0], 'nearest');
    expect(i).toBe(0);
  })


  it ('should get the next i after t' , ()=>{
    const t = 300;
    const i = col.getI(t, 'after');
    expect(Math.abs(col.t[i])).toBeGreaterThan(t);
    expect(Math.abs(col.t[i-1])).toBeLessThan(t);
  })
  it ('should get the last i before t' , ()=>{
    const t = 500;
    const i = col.getI(t, 'before');
    expect(Math.abs(col.t[i+1])).toBeGreaterThan(t);
    expect(Math.abs(col.t[i])).toBeLessThan(t);
  })
  it('should create a BinField', ()=>{
    expect(col).toEqual(data.POS);

  })
})

describe("slicing a BinField", async () => {
    
    const col = new BinField(data.POS);
  
    it ('should slice the data' , ()=>{
      const tStart = 200;
      const tEnd = 300;
      const sliced = col.slice(tStart, tEnd);
      expect(Object.keys(sliced).length).toBe(Object.keys(col).length);
      expect(sliced.t[0]).toBeCloseTo(tStart,1);
      expect(sliced.t[0]).toBeLessThan(tStart);
      expect(sliced.t[sliced.t.length-1]).toBeCloseTo(tEnd, 1);
      expect(sliced.t[sliced.t.length-1]).toBeGreaterThan(tEnd);
    })
  
    
})




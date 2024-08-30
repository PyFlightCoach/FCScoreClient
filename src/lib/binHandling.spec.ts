import BINWorker from '$lib/JsDataflashParser/parser.js?worker';
import {readFile} from 'fs/promises';
import {Blob} from 'buffer';
import {describe, expect, it} from 'vitest';


const worker = new BINWorker();
let data: Record<string, any> = {};
let reader = new FileReader();
reader.onload = (e) => {
    let data = reader.result;
    worker.postMessage({
        action: 'parse',
        file: data,
        msgs: msgs
    });
};
const file: Blob = new Blob([await readFile('src/lib/test_data/00000048.BIN')]);
reader.readAsArrayBuffer(file);


worker.onmessage = (event) => {
    if (event.data.hasOwnProperty('messageType')) {        
        data[event.data.messageType] = event.data.messageList;
    }
};

describe("loaded data", () => {
    
    it('does exist', ()=> {
        expect(data).not.toEqual({});
    })

})

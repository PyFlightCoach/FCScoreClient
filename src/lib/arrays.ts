

export function linspace(start: number, stop: number, num: number) {
  const step = (stop - start) / (num-1);
  let arr:number[]=[];
  for (let i=0; i<num; i++) {
    arr.push(start + step * i)
  }
  return arr;
}



export const max = (arr: number[]) => {
  return arr.reduce((a, b) => Math.max(a, b), -Infinity);
}

export const min = (arr: number[]) => {
  return arr.reduce((a, b) => Math.min(a, b), Infinity);
}

export const sum = (arr: number[]) => {
  return arr.reduce((a, b) => (a + b));
}

export const mean = (arr: number[]) => {
  return sum(arr) / arr.length;
}


export function parse_dict(data: Record<string, any>, parser) {
  let outdata: Record<string, any> = {};
  Object.entries(data).forEach(entry => {outdata[entry[0]] = parser(entry[1]);});
  return outdata;
}

  
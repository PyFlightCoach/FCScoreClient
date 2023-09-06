

export function linspace(start: number, stop: number, num: number) {
    const step = (stop - start) / (num-1);
    let arr:number[]=[];
    for (let i=0; i<num; i++) {
        arr.push(start + step * i)
    }
    return arr;
}

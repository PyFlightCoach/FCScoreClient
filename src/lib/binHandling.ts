import { makeVector, Vector, Table } from "apache-arrow";
import { Int32 } from "apache-arrow/Arrow.node";



export function mergeTimestamps(a: number[], b: number[]) {
  
  const va = makeVector(Int32Array.from(a));
  const vb = makeVector(Int32Array.from(b));
  return va
}
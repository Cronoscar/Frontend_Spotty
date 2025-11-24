export const splitN = <T> (xs: T[], size: number): T[][] => !size || xs.length == 0 ? [] : [ xs.slice(0, size) ].concat( splitN( xs.slice(size) , size ) );

export const init = <T> (xs: T[]): T[] => xs.slice(0, xs.length - 1);

export const initAt = <T> (xs: T[][], idx: number): T[][] => xs.slice(0, idx).concat( [ init(xs[idx]) ] ).concat( xs.slice(idx + 1, xs.length) );

export const concatAt = <T> (xs: T[][], e: T, idx: number): T[][] => xs.slice(0, idx).concat( [ xs[idx].concat(e) ] ).concat( xs.slice(idx + 1, xs.length) );

export const deleteAt = <T> (xs: T[], idx: number): T[] => xs.slice(0, idx).concat( xs.slice(idx + 1, xs.length) );
// export type Expand<T> = T extends (...args: infer A) => infer R
//   ? (...args: Expand<A>) => Expand<R>
//   : T extends infer O
//   ? { [K in keyof O]: O[K] }
//   : never;

// export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
//   ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
//   : T extends object
//   ? T extends infer O
//     ? { [K in keyof O]: ExpandRecursively<O[K]> }
//     : never
//   : T;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
// export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
// export type DeepWriteable<T> =
//   T extends ReadonlyArray<infer U> ? DeepWriteableArray<U> :
//   T extends object ? { -readonly [P in keyof T]: DeepWriteable<T[P]> } :
//   T;

// interface DeepWriteableArray<T> extends Array<DeepWriteable<T>> {}

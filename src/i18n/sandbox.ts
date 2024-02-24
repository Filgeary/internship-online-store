import { Translations } from "./types";
import {default as translation} from './sandBoxru.json';

type TreeDict = typeof translation
type TreeKeys = keyof TreeDict;
let a: TreeDict;

type TreeDictionary<T> = T extends object
  ? {[key in keyof T]: T[key] | `.${TreeDictionary<keyof T[key]>}`}
  : never



type TestD<T extends object> = {
  [key in keyof T]: `${key extends string
    ? key
    : ''}${T[key] extends object
      ? `.${TestD<T[key]>}`
      : never }`
}[keyof T]


let b: TestD<TreeDict>





t2("adding.ok")

function t2(text: keyof Flatten<TreeDict>) {

}





type Flatten<T extends object> = {
  [K in keyof T]-?: (
    x: NonNullable<T[K]> extends infer V
      ? V extends object
        ? V extends readonly any[]
          ? Pick<T, K>
          : Flatten<V> extends infer FV
          ? {
              [P in keyof FV as `${Extract<K, string>}.${Extract<P, string>}`]: FV[P]
            }
          : never
        : Pick<T, K>
      : never
  ) => void
} extends Record<keyof T, (y: infer O) => void>
  ? O extends unknown
    ? { [K in keyof O]: O[K] }
    : never
  : never



let tt: Flatten<TreeDict>

// DOT PREFIX

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`

type DotNestedKeys<T> = (T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
    : "") extends infer D ? Extract<D, string> : never;

/* testing */

let doted: DotNestedKeys<TreeDict>

function t3(text: DotNestedKeys<TreeDict>) {

}

///
type ObjectPath<T extends object, D extends string = ''> = {
  [K in keyof T]: `${D}${Exclude<K, symbol>}${'' | (T[K] extends object ? ObjectPath<T[K], '.'> : '')}`
}[keyof T]

let op: ObjectPath<TreeDict>

function t4(text: ObjectPath<TreeDict>) {

}





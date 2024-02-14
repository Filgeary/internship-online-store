import * as translations from "./translations";

type TTranslations = typeof translations;
export type Lang = keyof TTranslations;
export type Text = keyof TTranslations[Lang];
// type Dictionary = {
//   [key in Lang]: TTranslations[key];
// };

// export type NestedKeyOf<T, K = keyof T> = K extends keyof T & (string | number)
//   ? `${K}` | (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never)
//   : never;
// type NestedKeyOf<ObjectType extends object> = {
//   [Key in keyof ObjectType]: ObjectType[Key] extends object
//     ? Key extends string ? Key | `${Key}.${NestedKeyOf<ObjectType[Key]> extends infer U extends string
//         ? U
//         : never}`
//     : Key : never;
// }[keyof ObjectType];


// type a = NestedKeyOf<Dictionary[Lang]>

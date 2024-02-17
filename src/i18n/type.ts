import * as translations from "./translations";

type TTranslations = typeof translations;
export type Lang = keyof TTranslations;
export type Dictionary = TTranslations['ru'];

export type Text = NestedKeyOf<Dictionary>;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & string];

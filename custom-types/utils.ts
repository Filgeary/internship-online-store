/* eslint-disable @typescript-eslint/no-unused-vars */

interface Test {
  _id: string | number;
  title: string;
  price: number;
  other: { a: number; b: string };
  [prop: string]: any;
}

/**
 * Возвращает новый интерфейс содержащий только перечисленные ключи из `Interface`.
 */
export type ExtractFields<Interface, Fields> = { [Key in Extract<Fields, keyof Interface>]: Interface[Key] };

type a = ExtractFields<Test, '_id' | 'price'>;
/* Вывод:
type a = {
    _id: string | number;
    price: number;
}
*/

/**
 * Возвращает новый интерфейс с объединением ключей `A` и `B`, причём если часть из них будет совпадать,
 * то будут использованы ключи из `A`.
 * Ограничение: `A` не должно содержать чего-то вроде `[prop: string]: any;`,
 * иначе проверка "есть ли `Key` в `A`?" всегда будет успешной и все ключи из `B` получат тип `any`.
 */
export type AddFields<A, B> = {
  [Key in keyof (A & B)]: Key extends keyof A ? A[Key] : Key extends keyof B ? B[Key] : never;
};

/**
 * Возвращает новый интерфейс на основе переданного, в котором все ключи,
 * кроме перечисленных ключей, являются опциональными.
 */
export type RequiredFields<Interface, Fields> = AddFields<ExtractFields<Interface, Fields>, Partial<Interface>>;

type c = RequiredFields<Test, '_id' | 'price'>;
/* Вывод:
type c = {
    [x: string]: any;
    _id: string | number;
    price: number;
    title?: string | undefined;
    other?: {
        a: number;
        b: string;
    } | undefined;
}
*/

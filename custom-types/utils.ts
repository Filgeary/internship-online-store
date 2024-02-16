/* eslint-disable @typescript-eslint/no-unused-vars */

interface Test {
  _id: string | number;
  title: string;
  price: number;
  other: { a: number; b: string };
  // [prop: string]: any;
}

/**
 * Возвращает новый интерфейс с объединением ключей `ObjA` и `ObjB`, причём если часть из них будет совпадать,
 * то будут использованы ключи из `ObjA`.
 * Ограничение: `ObjA` не должно содержать чего-то вроде `[prop: string]: any;`,
 * иначе проверка "есть ли `Key` в `ObjA`?" всегда будет успешной и все ключи из `ObjB` получат тип `any`.
 */
export type Merge<ObjA, ObjB> = {
  [Key in keyof (ObjA & ObjB)]: Key extends keyof ObjA ? ObjA[Key] : Key extends keyof ObjB ? ObjB[Key] : never;
};

/**
 * Возвращает новый интерфейс на основе переданного, в котором все ключи,
 * кроме перечисленных ключей, являются опциональными. Кроме того, проверяет чтобы имена полей
 * действительно существовали в исходном интерфейсе (проверка на опечатки), но это будет работать
 * только в том случае, если в исходном интерфейсе нет чего-то вроде `[prop: string]: any;`.
 */
export type RequiredFields<Interface, Keys extends keyof Interface> = Merge<
  Required<Pick<Interface, Keys>>, // Обязательные поля
  Partial<Interface> // Опциональные поля
>;

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

/**
 * Возвращает объединение типов значений ключей интерфейса: `{a: 'TA', b: 'TB'}` --> `'TA' | 'TB'`
 * Ограничение: Среди значений ключей (типов) не должно быть типа `string`,
 * только более конкретные типы, вроде "basket.articles", иначе преобразование будет некорректным.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Возвращает ключи перечисления
 */
export type EnumKeys<E> = keyof { -readonly [Key in keyof E]: any };

/**
 * Возвращает значения перечисления.
 * Ограничение: работает только для значений являющихся строками
 */
export type EnumValues<E> = keyof { [Key in E[keyof E] as `${Key & string}`]: any };

/* eslint-disable @typescript-eslint/no-unused-vars, prettier/prettier */

// Данные для тестирования
const translations = {
  basket: {
    articles: {
      // Дополнительный уровень вложенности
      sale: {
        one: 'article',
        other: 'articles',
      },
      default: 'article',
    },
    title: 'Cart',
  },
  title: 'Shop',
  menu: { main: 'Main' },
};

// Тип объекта переводов
type TTranslations = typeof translations;

// Формы числительных `"zero" | "one" | "two" | "few" | "many" | "other"`
type TPlural = Intl.LDMLPluralRule;

/**
 * Возвращает объединение типов значений ключей интерфейса: `{a: 'TA', b: 'TB'}` --> `'TA' | 'TB'`
 * Ограничение: Среди значений ключей (типов) не должно быть типа `string`,
 * только более конкретные типы, вроде "basket.articles", иначе преобразование будет некорректным.
 */
type ValueOf<T> = T[keyof T];

/**
 * Генерирует плоский словарь на основе древовидной структуры.
 * Ограничение: Нельзя в качестве имен ключей использовать слова из `Intl.LDMLPluralRule`,
 * потому что они расцениваются как относящиеся к множественному числу и
 * исключаются из результата: `"zero" | "one" | "two" | "few" | "many" | "other"`
 */
export type TGenDictionary<T, Parents extends string = ''> = ValueOf<{
  [Key in keyof T]: Key extends TPlural //                   ^^^^^^^ поднимаем результат наверх
    ? never // Если это один из типов TPlural, то исключаем его из результата
    : T[Key] extends object // Если это объект, то (используя `|`) объединяем следующие типы:
      ?
        | `${Parents}${Key & string}` // Текущий уровень, например `'basket'` (тут `Parents = ''`, `Key = 'basket'`)
        | TGenDictionary<T[Key], `${Parents}${Key & string}.`> // Плюс все потомки рекурсивно: `'basket.article' | 'basket.title' | ...`
      : `${Parents}${Key & string}`; // Если не объект, то просто добавим текущий уровень
      //                 ^^^^^^^^
      // Почему нужно `& string` описано тут: https://github.com/microsoft/TypeScript/issues/41196
}>;

type TDictionary = TGenDictionary<TTranslations>;

// Упрощённая функция переводов, просто для примера, вобще подсказки работали бы даже если бы в теле ничего небыло
const t = (text: TDictionary, plural?: number) => {
  const isObject = (x: any): x is object => typeof x === 'object';
  let obj = translations as Record<string, object | string>;
  let result;
  // Реализуем доступ к значению, разбивая по точкам (например 'basket.articles.default')
  text.split('.').forEach((key: string) => {
    if (isObject(obj[key])) obj = obj[key] as Record<string, object | string>;
    else result = obj[key]
  })

  if (typeof plural !== 'undefined') {
    const key: Intl.LDMLPluralRule = new Intl.PluralRules('en').select(plural);
    if (key in obj) return obj[key] as string ?? '';
  }
  return result ?? '';
};


// Вот тут подсказки работают
const test1 = t('basket');



/*
Об этом решении.

Решение сводится к "конвертации" задачи в ту, которую уже умеем решать.
Приведём тип к тому виду, с которым подсказки уже работают: `"title" | "basket.articles" | ...`

Первой идеей было рекурсивно конвертировать все ключи так, чтобы они содержали все имена предков через точку:

  {
    'title': 'text',
    'basket': {
      'basket.articles': 'text',
       ^^^^^^^^^^^^^^^ вот так должно выглядеть после конвертации
    },
  };

*/

type TChangeKeyName<T, Parents extends string = ''> = {
  [Key in keyof T as `${Parents}${Key & string}`]: TChangeKeyName<T[Key], `${Parents}${Key & string}.`>;
};

// Затем превратить ключи всех этих объектов в объединение типов возвращаемое keyof
// такого вида: `"title" | "basket.articles" | ...`

type TFlat<T> = {
  [Key in keyof T]: T[Key] extends object ? keyof TFlat<T[Key]> : `${Key & string}`;
};
type TChanged = TChangeKeyName<TTranslations>;
type TFlatted = ValueOf<TFlat<TChanged>>;

/*
Проблема оказалась в том, что это не даёт глубину больше `basket.articles`, потому что мы не можем
в имени ключа хранить объединение типов вида `"title" | "basket.articles" | ...`, а значит не можем
поднимать эту информацию выше из вложенных объектов.

Поэтому стал хранить имена предков в значениях ключей. Таким образом, при помощи дженерик типа `ValueOf`
можно собрать все значения ключей из объекта и передать их выше, накопить.

Допустим, это самый глубокий уровень в рекурсии. Значения ключей будут заменены на имена ключей с перечислением
всех предков через точку:

  {
    title: 'title',
    basket: {
      articles: 'basket.articles',
                 ^^^^^^^^^^^^^^^ значение ключа заменено на: "предки.имя_ключа"
      title: 'basket.title',
              ^^^^^^^^^^^^ значение ключа заменено на: "предки.имя_ключа"
    }
  }

После обработки дженериком ValueOf вложенного объекта 'basket' это превратится в:

  {
    title: 'title',
    basket: 'basket.articles' | 'basket.title'
  }

Затем на последней итерации (точнее уровне рекурсии) в:

'title' | 'basket.articles' | 'basket.title'

И это уже и будет результатом.

*/

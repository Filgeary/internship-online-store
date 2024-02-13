**Навигация**

[[_TOC_]]

# 🔥 Задача 3 #typescript

**Сделано по задаче 3**

- Реализовал интересную штуку. Дженерик тип `RequiredFields<Interface, Fields>`, который берёт интерфейс, и делает все его поля опциональными, кроме тех, которые были переданы. Таким образом, мы можем определить структуру типа `item` в одном месте (все поля обязательные) и затем для разных компонентов оставлять разные поля обязательными (при этом тип этих полей будет браться из исходного `item`). На основе этого дженерик типа был создан ещё один, который можно вызывать так: `RequiredItemFields<'_id' | 'price'>`. Вот пример использования `RequiredFields`:

```ts
interface Test {
  _id: string | number;
  title: string;
  price: number;
  other: { a: number; b: string };
  [prop: string]: any;
}

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
```

  Реализовано это так:

```ts
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
 * Для `B` такого ограничения нет, потому что всегда сначала будут браться ключи из `A`.
 */
export type AddFields<A, B> = {
  [Key in keyof (A & B)]: Key extends keyof A ? A[Key] : Key extends keyof B ? B[Key] : never;
//    магия тут ^^^^^^^
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
```

- Решил задачу с подсказками переводов в автодополнении, самое сложное в ней оказалось понять, что нужно добавить опцию `"resolveJsonModule": true` в `tsconfig.json`, без которой ничего не работает.

![Подсказка перевода](img/translateHint-1.png)

  Для типизации `i18n` использовал дженерик функцию `t`, которая может принимать тип текущего языка:

```tsx
export interface II18n {
  lang: TLangKeys,
  setLang: React.Dispatch<React.SetStateAction<TLangKeys>>,
  t: <Lang extends TLangKeys>(text?: TDictionary[Lang], number?: number) => ReturnType<typeof translate>,
  //                             код (тип) языка ^^^^
}

// ...

// Объект контекста
const i18n = useMemo(() => ({
    lang,
    setLang,
    t: (text: TDictionary[typeof lang], number) => translate(lang, text, number)
    //                    ^^^^^^^^^^^
    //                    передаём код (тип) языка
  } as II18n), [lang]);

```

Сами типы для "добывания" словарей из джейсонов реализованы так:

```ts
import * as translations from './translations';

// Тип объекта, опционально содержащий формы множественного числа
type TPlural = Partial<{ [HowMany in Intl.LDMLPluralRule]: string }>
/* Вывод:
type TPlural = {
    zero?: string | undefined;
    one?: string | undefined;
    two?: string | undefined;
    few?: string | undefined;
    many?: string | undefined;
    other?: string | undefined;
}
*/

// Тип переводов
type TLangType = typeof translations;

// Ключи типа пареводов: `en | ru`
export type TLangKeys = keyof TLangType;

// Тип для подсказок автодополнения
export type TDictionary = {
  [Property in TLangKeys]: keyof TLangType[Property];
  //         вот тут магия ^^^^^
  //         сохраняем имена ключей в качестве типа поля Property
}
/* Вывод:
type TDictionary = {
    en: "basket.articles" | "title" | "menu.main" | "basket.title" ...;
    ru: "basket.articles" | "session.signOut" ...;
}
*/
```

  Коме того, написал тип `TDictionaryTree`. Кроме ключей переводов, он содержит вложенные объекты с переводами форм множественного числа. `TDictionaryTree` требуется для типизации функции `translate`:

```ts
function translate<Lang extends TLangKeys>(lang: Lang, text?: TDictionary[Lang], plural?: number): string {
  const translationsLang = translations[lang] as TDictionaryTree[Lang];
  //                                             ^^^^^^^^^^^^^^^ ^^^^
  // ...
}
```

  Тип `TDictionaryTree` реализован так:

```ts
// Вспомогательный рекурсивный тип
type TGenTree<T> = { [Property in keyof T]: TGenTree<T[Property]> }
//                        рекурсивный вызов ^^^^^^^^

// Строим дерево типа
type TDictionaryTree = TGenTree<TLangType>
/* Вывод:
type TDictionaryTree = {
  en: TGenTree<{
    "basket.articles": {
        one: string;
        other: string;
    };
    "title": string;
    "menu.main": string;
    "basket.title": string;
    ...
  }>;
  ru: TGenTree<...>;
}
*/
```

  Был ещё альтернативный вариант без рекурсии, но он менее универсальный и более громоздкий:

```ts
// Другой вариант реализации TDictionaryTree
type TDictionaryTree = {
  [Property in TLangKeys]: {
    [Field in keyof TLangType[Property]]: TLangType[Property][Field] extends string ? string : TPlural;
  };
}
/* Вывод:
type TDictionaryTree = {
  en: {
    "basket.articles": Partial<{
      zero: string;
      one: string;
      two: string;
      few: string;
      many: string;
      other: string;
    }>;
    title: string;
    ...
  }
}
*/
```

  По задаче `i18n` вроде всё.

- Типизация стора сделана так:

```ts
type TActionsPartial = { [Property in keyof TModulesType]: InstanceType<TModulesType[Property]             > };
type TStatePartial   = { [Property in keyof TActions    ]: ReturnType  <TActions    [Property]['initState']> };

// Стейт форков ForkState подключается отдельно, потому что это не часть контента сайта, а часть механизма стора.
// Добавим его к типам стейта и экшенов как пересечение типов:
export type TActions = TActionsPartial & { ['forks']: ForkState                          };
export type TState   = TStatePartial   & { ['forks']: ReturnType<ForkState['initState']> };
```

Ещё можно получить сразу типы для стора через дженерик (это тоже работает), но запись более громоздкая:

```ts
// Альтернативный вариант реализации TState
type TGetState<Type extends Partial<InstanceType<abstract new (...args: any) => any>>> = {
  [Property in keyof Type]: ReturnType<InstanceType<Type[Property]>['initState']>;
};

type TStatePartial = TGetState<moduleType>;
export type TState = TStatePartial & { ['forks']: ReturnType<ForkState['initState']> };
```

- Типизировал `useSelector` вот так:

```ts
// Импортируем тип стора.
// Интересно, что если мы импортируем вместо него непосредственно тип стейта:
//   import type TState from '@src/store';
// то автодополнение не будет работать
import type Store from '@src/store';

// Селектор
type TSelectorFunc = (state: Store['state']) => Record<string, unknown>

export default function useSelector(selectorFunc: TSelectorFunc) {
  //...
  return state;
}
```

  Автодополнение работает (можно брать значения из разных срезов стейта, например `basket` и `article`):

![useSelector](img/useSelector-1.webm){width=100% height=100%}

- Типизировал все глупые компоненты.

- Подключил `ts|tsx`. Заодно подключил `ESlint`, `Stylelint` и `Prettier`, использовав конфиг который я писал ранее (немного допилил его). Причём только для новых файлов - все существующие файлы были добавлены в исключения. Для того, чтобы создать список исключений, я написал на ноде небольшую утилиту `./generateExcludePatchs.js` (на ноде никогда раньше не писал, поэтому за основу взял рекурсивный обход каталогов из статьи в интернете, ссылка не неё есть в файле скрипта). В качестве результата своей работы утилита создаёт файл `./exclude_paths_generated.txt`.
Работает следующим образом:

```md
Пример обработки:

  - Для файла с таким путём:

    './src/app/article/index.js'

  - Будут созданы следующие пути исключений:

    'src/app/article/index.js'
    'src/app/article/index.jsx'
    'src/app/article/index.ts'
    'src/app/article/index.tsx'

Это нужно, чтобы когда будем переводить js на ts,
после смены расширения файл всё равно остался в исключениях,
до тех пор, пока мы явно его оттуда не удалим.

То же делается для css файлов:

    './src/components/input/style.css'
                  |
                  v
    'src/components/input/style.css'
    'src/components/input/style.scss'
    'src/components/input/style.less'

```

- Добавил два скрипта (они запускают `ESlint` + `Prettier` + `Stylelint`):
  - `npm run lint`
  - `npm run fix`
- Типизировал глупый компонент `@src/components/article-card`, а так же функцию `@src/utils/number-format`, которую он использует, и ещё компонент `@src/components/button` который так же используется `article-card`.
Типизация пропсов `article-card`:

```ts
export interface IArticleCardProps {
  article: {
    _id: string | number;
    description: string;
    madeIn: Record<string, any>;
    category: Record<string, any>;
    edition: string | number;
    price: number;
  };
  onAdd?: (event?: any) => void;
  t?: (text?: string) => string;
  isDialogOpen?: boolean; // Когда открыто диалоговое окно, отображаем спиннер на кнопке
}
```

- Компонент `@src/components/button` выглядит так (он прокидывает часть пропсов напрямую в `<button>` используя `rest parameters` синтаксис):

```ts
function Button({ isLoading, value, size, height, ...props }: IButtonProps) {
  const cn = bem('Button');

  return (
    <button className={cn({ size, height })} {...props}>
      {isLoading ? <CircleSpinner /> : value}
    </button>);
}
```

пропсы типизированы так:

```ts
export interface IButtonProps {
  value?: string;                                // Опционально, потому что используем defaultProps в ArticleCard
  onClick?: (event?: React.MouseEvent) => void; // Опционально, потому что используем defaultProps в ArticleCard
  isLoading?: boolean;
  size?: string;
  height?: string;
  props?: Record<string, unknown>; // Мы не знаем какие ещё пропсы будут переданы,
                                   // может быть `disabled={true}` например.
                                   // Всё это будет собрано в объект (если есть что собирать).
  [propName: string]: unknown;     // Нужно чтобы небыло ошибок ts до того, как пропсы будут собраны в объект `props`
}
```

- Типизация пропсов для инпута:

```ts
export interface IInputProps {
  value: string;
  name?: string;
  type?: string;
  placeholder?: string;
  onChange?: (value: string, name?: string) => void; // onChange опционально, потому что defaultProps
  theme?:
    | 'big'
    | 'nano'; // Можно было бы вынести в отдельное перечисление или тип, но нужно ли?
  validation?:
    | 'onlyNumber';
  autoFocus?: boolean;
  delay?: number;
  minWidth?: number;
  stretch?: boolean;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  minDefaultValue?: number;
  maxDefaultValue?: number;
}
```

# 🔥 Задача 2 #modals

**Рефакторинг по задаче 2**
- Задача со звёздочкой:

```mermaid
flowchart TD
    useStore --> Store
    useSelector --> ForkArray
    ForkArray["<b>state.forks.list</b> \n Массив форков"] --> |Нужно для isCreated| Hook
    Store -->|"fork()"| Hook[Хук <b>useStateFork</b>]
    Store -->|"removeFork()"| Hook
    useEffect --> Hook
    Hook --> |"isCreated \n (форк создан)"| StateFork{"Компонент-\nобёртка \n <b>StateFork</b>"}
    Data("<b>Пропсы:</b><i>
      name,
      parentName,
      options,
      removeOnExit
    ") --> StateFork
    StateFork --> |Пропсы| Hook
    StateFork --> |isCreated = true| Show(Отобразить children)
    StateFork --> |isCreated = false| Hide(Ничего не отображать)
```

  Добавлен компонент-обёртка `StateFork`:

```jsx
// Компонент `StateFork` отображает `children` только после того,
// как форк среза стора для них успешно создан
{is('add-more-to-basket') && (
  <StateFork name={'add-more-to-basket'} parent='catalog'>
    <AddManyProducts context={'add-more-to-basket'} theme='big' indent={index} />
  </StateFork>
)}
```

  Чтобы компонент `StateFork` работал, добавлен хук `useStateFork`:
  - `useStateFork(name, parentName, opt = {}, removeOnExit = true)`
  Чтобы хук работал, в сторе (`src/store/index.js`) добавлены два метода:
  - `fork(name, parentName, opt = {})` где `opt` может содержать `{_id, configName, initStateName, initState}`
  - `removeFork(name)`
  Они меняют стейт через `this.setState(...)`. Ещё есть срез стора `ForkState` (`src/store/fork.js`) который хранит массив форков: можно из кода реагировать на его изменения (компонент `StateFork` использует это), проверять существует ли форк, итд. Кроме того, сейчас этот массив используется, чтобы предотвратить случайное удаление среза стора, не являющегося форком (то есть оригинала). Вот пример данных объекта внутри массива:

```js
{
  name: "myFork",
  parent: "catalog",
  options: {
    _id: "myFork",           // если не задано, то используется `name`
    configName: "catalog",   // если не задано, то используется `parent`
    initStateName: "myFork", // если не задано, то используется `name`
    initState: null,         // если не задано, то `null`
  },
}
```

- Сделал тёмную тему для логгера, когда меняется стейт. А то ничего не видно было. Тема установленная в операционной системе (`prefers-color-scheme`) определяется через `js`. К сожалению, это не работает, если поменять тему в браузере или только в консоли.

![Тёмная тема для логгер](img/loggerTheme-1.png)

- Ширина поля ввода количества товаров теперь "расширяется" под длинну числа (минимальное значение - `2` символа), для этого использованы единицы ширины нулевого символа - `ch`. Кроме того, туда добавлены кнопки `-` и `+`. Всё вместе (инпут с кнопками `-` и `+`) вынесено в отдельный компонент `InputNumber`. Около кнопок оставлено небольшое пространство (`10px`) чтобы когда пользователь случайно не совсем попал по кнопке, не происходило снятия выделения с товара. Компонент имеет вот такой вид:

```jsx
<InputNumber
  placeholder={'шт'}
  minValue={1}    // Всё что меньше будет превращаться в `1`
  maxValue={9999} // Всё что больше будет превращаться в `9999`
  value={...}
  updateValue={...}
/>
```

![Массовое добавление в корзину](img/addManyToBasket-1.webm){width=975 height=620}

- При массовом добавлении товаров учтен такой кейс: если пользователь в поле `шт` стёр число у нескольких из выбранных товаров (подсвечиваются красным), но не у всех, а затем нажал кнопку `Добавить выбранные`, то будут добавлены только товары с ненулевым количеством штук. Если у всех выбранных товаров стёрто поле `шт`, то кнопка `Добавить выбранные` не активна.
- После добавления компонента `InputNumber` для выбора количества товаров, кнопка `Изменить` была переименована в `Настроить` (предполагаются дополнительные опции, которых пока нет: `Экспресс доставка` например). И теперь эта кнопка появляется только когда курсор находится над плашкой. Причём кнопка не исчезает пока открыто диалоговое окно и курсор находится не над ней. И ещё в это время на кнопке крутится спиннер, ожидая закрытия диалогового окна :)
- Исправлена ошибка: если открыть `корзина` -> `выбрать ещё товар` -> `настроить`. И в диалоговом окне кликнуть на ссылку чтобы перейти на страницу товара, то теперь все диалоговые окна и модалка закрываются при переходе на другую страницу. Кроме того, если потом вернуться на главную, то будет видно, что спиннер с кнопки тоже сбросился (в функции очистки `useEffect` имитируем нажатие кнопки `отмена`).
- Теперь для закрытия диалогового окна экшн `.close()` может принимать `id` окна которое нужно закрыть, или массив айдишников. Если в `.close()` ничего не было передано, то закроется верхнее окно. Кроме того, был добавлен экшн `.closeAll()`.
- Исправлена ошибка: если перейти на страницу товара (`Article`) или логина, затем обновить страницу, затем `корзина` -> `выбрать ещё товар`, то теперь список товаров отображается.
- Кнопка `Сбросить` в фильтрах (`CatalogFilter`) теперь не активна, если состояние параметров фильтров соотвествут начальному стейту (`initState`). Таким образом мы убираем возможность нажать на кнопку, нажатие на которую не произведёт никаких изменений в интерфейсе, то есть для пользователя нажатие на неё выглядело бы как "неработающая кнопка, нажимаю, нажимаю, кнопка нажимается, но ничего не происходит". Сейчас она сбрасывает пагинацию, но по хорошему, она не должна была бы её сбрасывать, потому что визуально слишком далеко от неё (её связь с пагинацией не очевидна для пользователя). Оставил как есть, потому что в курсе кажется требовалось, чтобы кнопка `Сбросить` сбрасывала пагинацию. Для сравнения объектов использована функция `shallowequal`.

![Кнопка Сбросить не активна](img/resetButtonDisabled-1.png)

- Изменена логика вызова диалоговых окон, чтобы в месте вызова можно было бы передать колбэк для обработки в случае успеха:

```js
const callbacks = {
  // Открытие диалогового окна выбора количества для добавления в корзину
  addToBasketDialog: useCallback((item, pcs = 1) => {
    // Открываем диалоговое окно и передаём ему колбэк на случай успеха
    dispatch(dialogsActions.open(context.dialogContext, result => {
      // Обработка в случае успеха (добавим в корзину)
      store.actions.basket.addToBasket(result);
    }));
    dispatch(addProductActions.setData(item)); // Отправляем данные для диалогового окна
    dispatch(addProductActions.setPcs(pcs));   // Устанавливаем начальное значение количества
  }, [store, context.dialogContext]),
}
```

- Логика обработки результата диалогового окна повторяется в каждом компоненте диалогового окна, поэтому вынес её в отдельный хук `useDialog`:

```js
useDialog({
  dialogName: props.context,     // Имя диалогового окна в массиве диалоговых окон
  waitingResult: select.waiting, // Завершён ли ввод пользователя, или ожидаем результата (нажатия кнопки)
  OkOrCancell: select.result,    // Нажал пользователь "Ок" или "Отмена"
  result: select.selected,       // Результат диалогового окна
  onCancel: callbacks.onCancel,  // Колбэк для сброса данных компонента, чтобы он корректно завершил работу,
})                               // как если бы была нажата кнопка "Отмена". Будет использован в функции очистки
                                 // `useEffect`. Это нужно для такого случая:
                                 //
                                 //   Если диалоговое окно было закрыто не кнопками, а кем-то ещё, например
                                 //   при закрытии всех окон при переходе на другую страницу, то сделаем вид,
                                 //   что была нажата кнопка "Отмена".
                                 //
                                 //   Это важно, например, для кнопки в каталоге, которая отображает спиннер, пока
                                 //   диалоговое окно (нужного типа) открыто. И нужно чтобы она знала,
                                 //   что теперь оно уже закрыто.
```

- Реализована массовая загрузка товаров с сервера в одном запросе. Функция стора `addToBasket` была модифицирована так, что теперь может принимать объект или массив объектов. Она сначала проверяет, если каждый товар в корзине, а те товары, которых нет - пушит в отдельный массив. Затем она из этого массива формирует запрос для загрузки только тех товаров, которых ещё нет в корзине.

---

**Рефакторинг по задаче 1**

- Логика связанная с конкретными диалоговыми окнами убрана из контейнера `Windows`.
- Теперь в редьюсере `dialogs` только два метода: `.open()` и `.close()`. И мы храним только имена диалоговых окон плюс их айдишники (если `id` не задан, то по дефолту равен имени). Айдишники нужны чтобы в будущем иметь возможность одновременно вызвать две модалки с одним именем, но с разным содержанием (например два стандартных уведомления с разным текстом). Если это вдруг зачем-то потребуется.
- Открытие диалогового окна стало проще, теперь достаточно имени:

```js
dispatch(dialogsActions.open('add-to-basket')); // Открываем диалоговое окно
dispatch(addToBasketActions.setData(item));     // Отправляем ему данные (если требуется)
```

- В диалоговом окне добавления товара в корзину, на инпут добавлен автофокус.

---

**Сделано по задаче 2**

- Была решена интересная проблема с кастомным стором: при массовом быстром добавлении товаров добавлялся только один товар. Это происходило из-за того, что функция добавления товара является асинхронной и в ней мы создаем новый массив товаров на основе текущего стейта. Когда новый товар добавляется в момент, когда предыдущий ещё ожидает ответа от сервера, то в итоге, массив с новым товаром заменяет массив с предыдущим, потому что в качестве исходного массива у них был один и тот же массив.
- В окне массового добавления в корзину можно задать количество штук каждого товара (открывается ещё одно диалоговое окно), при этом отображается сумма и количество (в диалоговом окне тоже).
- Если попробовать повторно изменить количество штук для товара, то начальное значение будет не `1`, а то, которое было сохранено.
- Выделенные товары отмечаются цветом. Только для выделенных товаров отображается: кнопка `Изменить` (количество штук), количество штук и сумма. Для невыделенных товаров ничего из этого не отображается, только вместо суммы - цена.
- После закрытия и повторного открытия окна выделенные товары сбрасываются.
- Кнопка `Добавить выбранные` не активна, когда ни один итем не выбран.
- Кнопка в корзине `Выбрать ещё товар` когда в корзине нет ни одного товара имеет тест `Выбрать товар`.
- Сейчас диалоговые окна в контейнере `Windows` в `.map()` отображаются так:

```jsx
{ is('add-to-basket')   && <AddProduct context={'add-to-basket'} indent={index} /> }
{ is('add-to-selected') && <AddProduct context={'add-to-selected'} indent={index} /> }
//                          ^^^^^^^^^^ один компонент для разных контекстов
```

# 🔥 Задача 1 #modals

**Сделано**

- Возможность открыть несколько диалоговых окон одно над другим и над модалкой `Корзина` (чтобы протестировать это добавлены дополнительные кнопки, открывающие дополнительное окно в диалоговом окне и в модалке).
- При надатии на кнопку `Добавить` в списке товаров, на ней крутится спиннер пока диалоговое окно открыто. То же работает и на странице товара (`Article`).
- Валидация инпута `2 шт` при добавлении в корзину (он не позволяет вводить левые символы)
  - `23kj2` -> `232`,
  - `0012`  -> `12`,
  - `0`     -> `1`
- Кнопка `Ок` становится неактивной, если поле `2 шт` пустое.
- Диалоговое окно, в отличие от модалки, закрывается по клику на окружающее пространство (то же, что нажать `Отмена`). В будущем можно добавить опцию для "важных" окон, чтобы их можно было закрыть только нажатием на `Ок` или `Отмена`.
- Дизайн диалогового окна позволяет добавить позже дополнительные платные опции (например `Экспресс доставка` или `Подарочная упаковка`) путём простого добавления этих опций и поля `Итого` внизу.

---

**Реализация нескольких диалоговых окон одно над другим:**

**Допущения:**

 - Модальное окно может быть только одно, в нём можно реализовать смену контента, если нужно несколько модалок.
 - Диалоговых окон может быть много.
 - Диалоговые окна отображаются всегда выше модальных.
 - Модальное окно и диалоговые окна могут вызывать новые диалоговые окна.
 - Диалоговое окно не должно вызывать модальное окно.
 - Диалоговые окна блокируют экран под собой, так же как и модальное окно (но без затенения),
   поэтому они будут закрыты в том же порядке, что и были открыты (но с конца естественно).
   Порядок важен для диалоговых окон, которые вызвали новые диалоговые окна и ждут их результат.
 - При клике на блокирующую подложку диалогового окна, оно закрывается как если бы была
   нажата кнопка "Отмена". В будущем, можно сделать опцию "Важное диалоговое окно", и такое
   окно будет закрываться исключительно по клику на одну из кнопок.

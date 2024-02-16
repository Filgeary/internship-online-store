import { type EnumValues } from './utils';

/**
 * Контекст для открываемых диалоговых окон. Контекст влияет на внешний вид диалогового окна,
 * например у контекста 'add-to-basket' диалоговое окно будет иметь заголовок "Добавить в корзину",
 * а в контексте 'add-to-selected' тот же компонент диалогового окна будет иметь заголовок
 * "Дополнительные опции товара". Кроме того, имя контекста используется в качестве имени форка среза стора.
 * В одном из предыдущих вариантов реализации, контекст так же влиял на поведение: выбор обработки результата после
 * нажатия кнопки "Ок" происходил в компоненте диалогового окна в зависимости от контекста (по сути, там просто диспатчились
 * разные экшены в зависимости от контекста), но потом я перенёс обработку результата в место вызова диалогового окна.
 */
export enum EContext {
  addToBasket = 'add-to-basket',
  addToSelected = 'add-to-selected',
  addMoreToBasket = 'add-more-to-basket',
}

/**
 * Тип объединяющий значения (!) перечисления EContext
 */
export type TContext = EnumValues<typeof EContext>;

/**
 * Преобразование списка в иерархию.
 * @param tree {Array} Иерархия - список узлов со свойством children.
 * @param [callback] {Function} Для пользовательского преобразования элемента.
 * @param [level] {Number} Начальный уровень вложенности.
 * @param [result] {Array} Результат функции (используется рекурсией).
 * @returns {Array} Корневые узлы
 */
function treeToList<T>(
  tree: TBranch[],
  callback: (item: any, level: number) => T,
  level: number = 0,
  result: T[] | any = []
) {
  for (const item of tree) {
    result.push(callback ? callback(item, level) : item);
    if (item.children?.length)
      treeToList(item.children as TBranch[], callback, level + 1, result);
  }
  return result;
}

export default treeToList;

import {Tree} from "@src/shared/utils/list-to-tree";

/**
 * Преобразование списка в иерархию.
 */
function treeToList<T> (tree: Tree[], callback: (item: Tree, level: number) => T, level: number = 0, result: T[] = []): T[] {
  for (const item of tree) {
    result.push(callback(item, level));
    if (item.children?.length) treeToList(item.children, callback, level + 1, result);
  }
  return result;
}

export default treeToList;


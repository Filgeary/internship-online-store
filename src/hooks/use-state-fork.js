import { useEffect, useMemo } from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";

/**
 * Хук создания форка части стора
 * @param initFunc {Function} Пользовательская функция
 * @param name {String} Имя форка
 * @param parentName {String} Имя родителя
 * @param opt {Object}
 * @param removeOnExit {Bolean} Удалить форк в функции очистки useEffect
 * @returns {Boolean}
 */
export default function useStateFork(name, parentName, opt = {}, removeOnExit = true) {
  const store = useStore();

  useEffect(() => {
    // Создаём форк, только если имя действительно было передано и оно не то же самое, что parentName
    if (name && parentName && name !== parentName) {
      store.fork(name, parentName, opt)
      if (removeOnExit) return () => store.removeFork(name);
    };
  }, [name]);

  // Посмотрим, удалось ли создать форк
  const select = useSelector(state => ({
    forks: state.forks.list,
  }));

  // Это лучше чем просто `state[name]`, потому что форк может быть не создан, например, по причине того,
  // что имеет то же имя, что и другой оригинал (в этом случае state[name] !== undefined, то есть вернёт true).
  // Тут мы проверяем именно форки.
  const isCreated = useMemo(() => (
    Boolean(select.forks.find(({ options }) => options._id === name))
  ), [name, select.forks]);

  // Создан ли форк
  return isCreated;
}

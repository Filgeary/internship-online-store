/**
 * Небольшая функция для закрытия модалок или выпадающих списков
 * @param closingFunction функция для закрытия модалки
 * @throws {Error} не вызывать без навешивания на элемент который необходимо закрыть e.stopPropagation(), иначе событие с window будет закрывать компонент при любом нажатии
 * @return возвращает функцию для отписки от событий окна
 * */

export default function closingComponents(closingFunction: () => void): () => void {
  const closingForKey = (e: KeyboardEvent) => e.code === 'Escape' ? closingFunction() : null
  window.addEventListener('keydown', closingForKey);
  window.addEventListener('click', closingFunction);
  return () => {
    window.removeEventListener('keydown', closingFunction);
    window.removeEventListener('click', closingFunction);
  };
}


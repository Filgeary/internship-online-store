/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';

/**
 * Возвращает ссылку на узел, сохранённую в `useState`, и функцию `checkNode` для пропса `ref={checkNode}`.
 * Этот подход позволяет обновить элемент, когда узел действительно будет создан.
 * В хуках, которые используют `node` можно проверить есть ли нода и быть уверенным,
 * что хук будет перезапущен, когда нода появится.
 */
export default function useNode(): [HTMLDivElement | null, (nodeEl: HTMLDivElement) => void] {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const checkNode = useCallback((nodeEl: HTMLDivElement) => {
    if (nodeEl) setNode(nodeEl);
  }, []);

  return [node, checkNode];
}

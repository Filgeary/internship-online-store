/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

/**
 * Запустит колбэк один раз после того, как будет вызвана возвращаемая функция.
 * Используется для загрузки данных с сервера, когда пользователь
 * впервые начал взаимодействовать с элементом.
 */
export default function useInitOnUserAction(callback: () => void) {
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (isActive) callback(); // выполнится один раз, после установки isActive в true
  }, [isActive]);

  return useCallback(() => {
    if (!isActive) setActive(true);
  }, [isActive]);
}

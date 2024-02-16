import { I18nContext } from '@src/i18n/context';
import { useContext } from 'react';

/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate() {
  return useContext(I18nContext);
}

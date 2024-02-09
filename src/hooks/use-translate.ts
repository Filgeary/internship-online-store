import { useContext } from "react";

import { I18nContext } from "@src/i18n/context";

/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate() {
  return useContext(I18nContext);
}

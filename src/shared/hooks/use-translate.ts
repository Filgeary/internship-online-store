import {useContext} from "react";
import {I18nContext, I18nContextType} from "@src/shared/i18n/context";

/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate(): I18nContextType {
  return useContext(I18nContext);
}

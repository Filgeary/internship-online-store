import {useEffect, useMemo, useState} from 'react';
import useServices from './use-services';
import type { LangCode, LangCodes, ObjectTranslateKey, StringTranslateKey, TranslateKey } from '@src/i18n/types';
import I18nService from '@src/i18n';


/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate() {
  const i18n = useServices().i18n
  const [lang, setLocalLang] = useState(() => i18n.getLang())

  // function t(textKey: StringTranslateKey): ReturnType<I18nService['translate']>;
  // function t(textKey: ObjectTranslateKey, plural: number): ReturnType<I18nService['translate']>;
  // function t(textKey: TranslateKey, plural?: number | undefined): ReturnType<I18nService['translate']> {
  //   return i18n.translate(textKey, plural)
  // }

  // function t(...args: Parameters<I18nService['translate']>): ReturnType<I18nService['translate']> {
  //   return i18n.translate(...args)
  // }

  const t = i18n.translate.bind(i18n)

  const setLang = (lang: LangCode) => i18n.setLang(lang)
  const avaliableLangs = useMemo(() => i18n.getAvaliableLags(), [])

  const unsubscribe = useMemo(() => {
    return i18n.subscribe((lang) => {
      setLocalLang(lang)
    });
  }, []); 

  useEffect(() => unsubscribe, [unsubscribe]);

  return {t, lang, setLang, avaliableLangs}
}
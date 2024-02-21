import {useEffect, useMemo, useState} from 'react';
import useServices from './use-services';
import { LangCode } from '@src/i18n/types';


/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate() {
  const i18n = useServices().i18n
  const [lang, setLocalLang] = useState(() => i18n.getLang())

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
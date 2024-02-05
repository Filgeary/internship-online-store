import {useEffect, useMemo, useState} from 'react';
import useServices from './use-services';

/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate() {
  const i18n = useServices().i18n
  const [lang, setLocalLang] = useState(i18n.lang)
  const t = (text, number) => i18n.translate(text, number)
  const setLang = (lang) => i18n.setLang(lang)
  const avaliableLangs = i18n.avaliableLangs

  const unsubscribe = useMemo(() => {
    return i18n.subscribe((lang) => {
      setLocalLang(lang)
    });
  }, []); 

  useEffect(() => unsubscribe, [unsubscribe]);

  return {t, lang, setLang, avaliableLangs}
}
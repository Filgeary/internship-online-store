import {memo, useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import Select from "@src/components/select";
import { LangTitles, LangCodes, AvaliableLang } from "@src/i18n/types";

function LocaleSelect() {

  const {lang, setLang} = useTranslate();

  const options = {
    lang: useMemo<(AvaliableLang)[]>(() => ([
      {value: LangCodes.ru, title: LangTitles.ru},
      {value: LangCodes.en, title: LangTitles.en},
    ]), [])
  };

  return (
    <Select onChange={setLang} value={lang} options={options.lang}/>
  );
}

export default memo(LocaleSelect);

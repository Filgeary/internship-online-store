import {useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import Select from "@src/components/select";
import { Lang } from "@src/i18n/type";

function LocaleSelect() {

  const {lang, setLang} = useTranslate();

  const options = {
    lang: useMemo((): {value: Lang, title: string}[] => ([
      {value: "ru", title: 'Русский'},
      {value: "en", title: 'English'},
    ]), [])
  };

  return (
    <Select onChange={setLang} value={lang} options={options.lang}/>
  );
}

export default LocaleSelect;

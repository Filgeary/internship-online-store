import React, {memo, useMemo} from "react";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import Select from "@src/ww-old-components-postponed/select";

function LocaleSelect() {

  const {lang, setLang} = useTranslate();

  const options = {
    lang: useMemo(() => ([
      {value: 'ru', title: 'Русский'},
      {value: 'en', title: 'English'},
    ]), [])
  };

  return (
    <Select onChange={setLang} value={lang} options={options.lang}/>
  );
}

export default memo(LocaleSelect);

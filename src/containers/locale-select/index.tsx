import {memo, useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import Select from "@src/components/select";
import type { AvaliableLang } from "@src/i18n/types";
import useServices from "@src/hooks/use-services";

function LocaleSelect() {
  const avaliableLangs = useServices().i18n.config.avaliableLangs
  const {lang, setLang} = useTranslate();

  const options = {
    lang: useMemo<(AvaliableLang)[]>(() => (avaliableLangs), [])
  };

  return (
    <Select value={lang} options={options.lang} onChange={setLang}/>
  );
}

export default memo(LocaleSelect);

import { memo, useMemo } from "react";
import useTranslate from "@src/hooks/use-translate";
import Select from "@src/components/select";
import { Language } from "@src/i18n/types";

type Option = {
  value: Language;
  title: string;
};

function LocaleSelect() {
  const { lang, setLang } = useTranslate();

  const options = {
    lang: useMemo<Option[]>(
      () => [
        { value: "ru", title: "Русский" },
        { value: "en", title: "English" },
      ],
      []
    ),
  };

  //@ts-ignore
  return <Select onChange={setLang} value={lang} options={options.lang} />;
}

export default memo(LocaleSelect);

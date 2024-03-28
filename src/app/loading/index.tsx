import useTranslate from "@src/hooks/use-translate";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";

const Loading = () => {
  const { t } = useTranslate();
  return (
    <PageLayout>
      <TopHead />
      <Head title={t("title")}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <p>Загрузка...</p>
    </PageLayout>
  );
};

export default Loading;

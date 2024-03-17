import Head from "@src/components/head";
import PageLayout from "@src/components/page-layout";
import { Draw } from "@src/containers/draw";
import LocaleSelect from "@src/containers/locale-select";
import Navigation from "@src/containers/navigation";
import TopHead from "@src/containers/top-head";
import useTranslate from "@src/hooks/use-translate";

export const CanvasPage = () => {
  const { t } = useTranslate();

  return (
    <PageLayout>
      <TopHead />
      <Head title={t("draw.title")}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <Draw />
    </PageLayout>
  );
}

import Head from "@src/components/head";
import PageLayout from "@src/components/page-layout";
import LocaleSelect from "@src/containers/locale-select";
import Navigation from "@src/containers/navigation";
import TopHead from "@src/containers/top-head";
import { Worker } from "@src/containers/worker";
import useTranslate from "@src/hooks/use-translate";

export const WebWorkerPage = () => {
  const { t } = useTranslate();
  return (
  <PageLayout>
    <TopHead />
    <Head title={t("worker.title")}>
      <LocaleSelect />
    </Head>
    <Navigation />
    <Worker />
  </PageLayout>
)};

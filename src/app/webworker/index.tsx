import { memo } from "react";
import PageLayout from "../../components/page-layout";
import TopHead from "../../containers/top-head";
import Head from "../../components/head";
import LocaleSelect from "../../containers/locale-select";
import Navigation from "../../containers/navigation";
import useTranslate from "../../hooks/use-translate";
import WorkerTest from "../../components/worker-test";


function Webworkers() {
  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('menu.webworker')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <WorkerTest />
    </PageLayout>
  );
}

export default memo(Webworkers);

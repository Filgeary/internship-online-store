import { memo } from "react";
import PageLayout from "../../components/page-layout";
import TopHead from "../../containers/top-head";
import Head from "../../components/head";
import LocaleSelect from "../../containers/locale-select";
import Navigation from "../../containers/navigation";
import useTranslate from "../../hooks/use-translate";
import CanvasLayout from "../../containers/canvas-layout";


function Canvas() {
  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('menu.canvas')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <CanvasLayout />
    </PageLayout>
  );
}

export default memo(Canvas);

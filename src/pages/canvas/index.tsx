import React from 'react';
import TopHead from "@src/ww-old-containers/top-head";
import Head from "@src/ww-old-components-postponed/head";
import LocaleSelect from "@src/ww-old-containers/locale-select";
import PageLayout from "@src/ww-old-components-postponed/page-layout";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import Navigation from "@src/ww-old-containers/navigation";
import CanvasComponent from "@src/ww-old-components-postponed/canvas";

function Canvas() {

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title.canvas')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <CanvasComponent/>
    </PageLayout>
  );
}

export default Canvas;

import React from 'react';
import TopHead from "@src/containers/top-head";
import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import PageLayout from "@src/components/page-layout";
import useTranslate from "@src/hooks/use-translate";
import Navigation from "@src/containers/navigation";
import CanvasComponent from "@src/components/canvas";

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

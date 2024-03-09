import { memo } from 'react';

import useTranslate from '@src/hooks/use-translate';

import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';

import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import ArtCanvasWrapper from '@src/containers/art-canvas-wrapper';

function Art() {
  const { t } = useTranslate();

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title.community')}>
        <LocaleSelect />
      </Head>
      <Navigation />

      <div style={{ padding: '0 20px' }}>
        <ArtCanvasWrapper />
      </div>
    </PageLayout>
  );
}

export default memo(Art);

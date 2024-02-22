import { memo } from 'react';

import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';
import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import useTranslate from '@src/hooks/use-translate';
import SideLayout from '@src/components/side-layout';
import Messages from '@src/components/messages';
import MessagesWrapper from '@src/containers/messages-wrapper';

function Community() {
  const { t } = useTranslate();

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title')}>
        <LocaleSelect />
      </Head>
      <Navigation />

      <div style={{ padding: '0 20px' }}>
        {/* Сообщения от пользователей */}
        <MessagesWrapper />
      </div>
    </PageLayout>
  );
}

export default memo(Community);

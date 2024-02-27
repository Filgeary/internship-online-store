import { memo } from 'react';

import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';
import Chat from '@src/containers/chat';
import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import useSelector from '@src/hooks/use-selector';
import useTranslate from '@src/hooks/use-translate';

function ChatPage() {
  const { t } = useTranslate();

  const select = useSelector(state => ({
    token: state.session.token,
    user: state.session.user,
  }));

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title')}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <Chat
        token={select.token ?? ''}
        user={select.user}
      />
    </PageLayout>
  );
}

export default memo(ChatPage);

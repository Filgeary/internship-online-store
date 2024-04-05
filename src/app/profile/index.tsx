import { memo } from 'react';

import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';
import ProfileCard from '@src/components/profile-card';
import Spinner from '@src/components/spinner';
import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import useInit from '@src/hooks/use-init';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

function Profile() {
  const store = useStore();
  const { t } = useTranslate();

  useInit(async () => {
    await store.actions.profile.load();
  }, []);

  const select = useSelector(state => ({
    profile: state.profile.data,
    waiting: state.profile.waiting,
  }));

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title')}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <Spinner active={select.waiting}>
        <ProfileCard data={select.profile} />
      </Spinner>
    </PageLayout>
  );
}

export default memo(Profile);

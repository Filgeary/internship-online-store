import React, {memo} from 'react';
import useInit from "@src/shared/hooks/use-init";
import useTranslate from "@src/shared/hooks/use-translate";
import PageLayout from "@src/shared/ui/layout/page-layout";
import TopHead from "@src/feature/top-head";
import Head from "@src/shared/ui/layout/head";
import LocaleSelect from "@src/feature/locale-select";
import Navigation from "@src/feature/navigation";
import Spinner from "@src/shared/ui/layout/spinner";
import ProfileCard from "@src/pages/profile/components/profile-card";
import useSelector from "@src/shared/hooks/use-selector";
import useStore from "@src/shared/hooks/use-store";

function Profile() {
  const store = useStore();

  useInit(() => {
    store.actions.profile.load();
  }, []);

  const select = useSelector(state => ({
    profile: state.profile.data,
    waiting: state.profile.waiting,
  }));

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
    <Head title={t('title.main')}>
  <LocaleSelect/>
  </Head>
  <Navigation/>
  <Spinner active={select.waiting}>
  <ProfileCard data={select.profile}/>
  </Spinner>
  </PageLayout>
);
}

export default memo(Profile);

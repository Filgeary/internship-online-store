import {memo, useCallback, useMemo} from 'react';
import {useParams} from "react-router-dom";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import Navigation from "@src/containers/navigation";
import Spinner from "@src/components/spinner";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import ProfileCard from "@src/components/profile-card";

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
      <Head title={t('title')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <Spinner active={select.waiting}>
        <ProfileCard data={select.profile} t={t}/>
      </Spinner>
    </PageLayout>
  );
}

export default memo(Profile);

import {memo} from 'react';
import useStore from "../../ww-old-hooks-postponed/use-store";
import useSelector from "../../ww-old-hooks-postponed/use-selector";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import useInit from "../../ww-old-hooks-postponed/use-init";
import PageLayout from "@src/ww-old-components-postponed/page-layout";
import Head from "@src/ww-old-components-postponed/head";
import Navigation from "@src/ww-old-containers/navigation";
import Spinner from "@src/ww-old-components-postponed/spinner";
import LocaleSelect from "@src/ww-old-containers/locale-select";
import TopHead from "@src/ww-old-containers/top-head";
import ProfileCard from "@src/ww-old-components-postponed/profile-card";

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

import { memo, useEffect } from 'react';

import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';
import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import useInit from '@src/hooks/use-init';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import WorkerMain from './components/worker-main';

function Worker() {
  const store = useStore();
  const { t } = useTranslate();

  useInit(async () => {
    await store.actions.worker.init();
  }, []);

  useEffect(() => {
    return () => {
      store.actions.worker.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = useSelector(state => ({
    message: state.worker.message,
  }));

  const handlePostMessage = (text: string) => store.actions.worker.postMessage(text);

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title')}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <WorkerMain
        message={select.message}
        postMessage={handlePostMessage}
      />
    </PageLayout>
  );
}

export default memo(Worker);

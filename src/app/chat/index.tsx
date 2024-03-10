import React, {memo} from 'react';
import PageLayout from "@src/components/page-layout";
import TopHead from "@src/containers/top-head";
import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import Navigation from "@src/containers/navigation";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import ChatContainer from "@src/containers/chat-container";

function Chat() {
  const {t} = useTranslate();

  const store = useStore()

  useInit(() => {
    store.actions.chat.initChat()
  }, [])

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title.chat')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <ChatContainer/>
    </PageLayout>
  );
}

export default memo(Chat);

import React, {memo} from 'react';
import useTranslate from "@src/shared/hooks/use-translate";
import useStore from "@src/shared/hooks/use-store";
import useInit from "@src/shared/hooks/use-init";
import PageLayout from "@src/shared/ui/layout/page-layout";
import TopHead from "@src/feature/top-head";
import Head from "@src/shared/ui/layout/head";
import LocaleSelect from "@src/feature/locale-select";
import Navigation from "@src/feature/navigation";
import ChatContainer from "@src/pages/chat/components/chat-container";

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

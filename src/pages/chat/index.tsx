import React, {memo} from 'react';
import PageLayout from "@src/ww-old-components-postponed/page-layout";
import TopHead from "@src/ww-old-containers/top-head";
import Head from "@src/ww-old-components-postponed/head";
import LocaleSelect from "@src/ww-old-containers/locale-select";
import Navigation from "@src/ww-old-containers/navigation";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import useInit from "../../ww-old-hooks-postponed/use-init";
import useStore from "../../ww-old-hooks-postponed/use-store";
import ChatContainer from "@src/ww-old-containers/chat-container";

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

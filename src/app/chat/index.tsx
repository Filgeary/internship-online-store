import { memo, FC, useEffect, useCallback } from "react"
import ChatLayout from "@src/components/chat-layout"
import PageLayout from "@src/components/page-layout"
import Head from "@src/components/head"
import TopHead from "@src/containers/top-head"
import Navigation from "@src/containers/navigation"
import LocaleSelect from "@src/containers/locale-select"
import useTranslate from "@src/hooks/use-translate"
import useInit from "@src/hooks/use-init"
import useStore from "@src/hooks/use-store" 
import useSelector from "@src/hooks/use-selector"
import { StoreState } from "@src/store/types"

const Chat: FC = () => {

  const {t} = useTranslate() 

  const store = useStore();

  const select = useSelector((state: StoreState) => ({
    messages: state.chat.messages
  }));

  const callbacks = {
    // Отправка сообщения
    onMessage: useCallback((text: string) => {store.actions.chat.newMessage(text)}, [store]),
  };
 
  useEffect(() => {
    store.actions.chat.onConnect()
    // store.actions.chat.newMessage("Сообщение от Натальи")
     return () => store.actions.chat.close()
  }, [])

  return (
    <PageLayout>
      <TopHead />
      <Head title={t("menu.chat")}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <ChatLayout onMessage={callbacks.onMessage}/>
    </PageLayout>
  );
};

export default memo(Chat);

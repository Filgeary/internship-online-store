import ChatLayout from "@src/components/chat-layout";
import Menu from "@src/components/menu";
import { MenuItem } from "@src/components/menu/types";
import SideLayout from "@src/components/side-layout";
import ChatMessageCreator from "@src/containers/chat-message-creator";
import ChatMessages from "@src/containers/chat-messages";
import TopHead from "@src/containers/top-head";
import useInit from "@src/hooks/use-init";
import useServices from "@src/hooks/use-services";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { memo, useCallback, useMemo } from "react";

function Chat() {
  const {t} = useTranslate();
  const store = useStore();
  const services = useServices()

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
      {key: 2, title: t('menu.chat'), link: '/chat'},
    ]), [t])
  };

  const callbacks = {

    // Обработка перехода на главную
    onNavigate: useCallback((item: MenuItem) => {
      if (item.key === 1) store.actions.catalog.resetParams();
    }, [store])
  }

  useInit(() => {
    store.actions.chat.startListening()
  }, [])

  return (
    <ChatLayout
      head={
        <SideLayout side='between'>
          <Menu items={options.menu} onNavigate={callbacks.onNavigate}/>
          <TopHead/>
        </SideLayout>
      }
    >
      <ChatMessages/>
      <ChatMessageCreator/>
    </ChatLayout>
  )
}

export default memo(Chat)
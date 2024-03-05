import { memo, useCallback, useEffect } from "react";
import SideLayout from "../../components/side-layout";
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import InputTextarea from "../../components/input-textarea";
import ChatDisplay from "../../components/chat-display";
import { ChatItemType } from "../../types/chat";
import ChatMessage from "../../components/chat-message";

function ChatRoom() {
  const store = useStore();

  const select = useSelector((state) => ({
    list: state.chat.list,
    user: state.session.user,
  }));

  useEffect(() => {
    store.actions.chat.getMessages();

    return () => store.actions.chat.closeConnection();
  }, []);

  const callbacks = {
    addMessage: useCallback((value: string) => {
      const newPost: ChatItemType = {
        _id: "self" + self.crypto.randomUUID(),
        _key: self.crypto.randomUUID(),
        text: value,
        dateCreate: new Date().toISOString(),
        author: {
          _id: select.user._id,
          profile: {
            name: select.user.profile.name,
          }
        },
        status: "pending",
      }
      store.actions.chat.sendMessage(newPost)
    }, [store]),
    loadOldMessages: useCallback(() => store.actions.chat.requestOldMessages(), [store])
  }

  const messages = select.list.map(item => (
    <ChatMessage key={item._id} item={item} self={item.author._id === select.user._id} />
  ))


  return (
    <SideLayout
      side={"between"}
      padding={"small"}
      direction={"column"}
      alignItems={"stretch"}
    >
      <ChatDisplay list={messages} onTopBorderReached={callbacks.loadOldMessages} />
      <InputTextarea onClick={callbacks.addMessage} />
    </SideLayout>
  );
}

export default memo(ChatRoom);

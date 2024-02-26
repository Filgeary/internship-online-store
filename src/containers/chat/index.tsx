import { AddMessageForm } from "@src/components/add-message-form";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import { useEffect } from "react";
import {v4 as uuidv4} from 'uuid';

const wsChannel = new WebSocket("ws://example.front.ylab.io/chat");

export const Chat = () => {
  const { t } = useTranslate();

  const select = useSelector(state => ({
    token: state.session.token
  }))

  useEffect(() => {
    wsChannel.addEventListener('open', () => {
      wsChannel.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token: select.token,
          },
        })
      )
    })
  }, [wsChannel])

  const callbacks = {
    onSubmit: (message: string) => {
      wsChannel.send(
        JSON.stringify({
          method: "post",
          payload: {
            _key: uuidv4(),
            text: message,
          },
        })
      );
    }
  }

  return (
    <AddMessageForm
      labelSend={t("chat.send")}
      labelPlaceholder={t("chat.placeholder")}
      onSubmit={callbacks.onSubmit}
    />
  );
}

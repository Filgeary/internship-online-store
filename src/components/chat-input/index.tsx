import {
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import sendIcon from "./send_button.svg";
import useInit from "@src/hooks/use-init";

interface IChatInputProps {
  disabled: boolean,
  onSubmit: (text: string) => void,
}

function ChatInput(props: IChatInputProps) {
  const cn = bem("ChatInput");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useInit(() => {
    textareaRef.current?.focus();
  }, [])

  const callbacks = {
    onChange: useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "0px";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }, [textareaRef]),
    onSubmit: useCallback(() => {
      if (!textareaRef.current) {
        return;
      }
      props.onSubmit(textareaRef.current.value);
      textareaRef.current.value = "";
    }, [textareaRef]),
    onKeyUp: useCallback((e: React.KeyboardEvent) => {
      if (!e.shiftKey && e.key === "Enter") {
        callbacks.onSubmit();
      }
    }, [textareaRef])
  };
  

  return (
    <div className={cn()}>
      <div className={cn("inputWrapper")}>
        <div></div>
        <textarea
          ref={textareaRef}
          placeholder="Сообщение"
          className={cn("textarea")}
          onKeyUp={callbacks.onKeyUp}
          onChange={callbacks.onChange}
        />
      </div>
      <button className={cn("button")} disabled={props.disabled} onClick={callbacks.onSubmit}>
        <img src={sendIcon} alt="" className={cn("icon")}/>
      </button>
    </div>
  );
}

export default memo(ChatInput);

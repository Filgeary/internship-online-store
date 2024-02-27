import { ChangeEvent, FC, FormEvent, useRef, useState } from "react"
import { cn as bem } from "@bem-react/classname";
import useAutosizeTextArea from "@src/hooks/use-auto-height";
import { AddMessageFormProps } from "./type"
import './style.css'

export const AddMessageForm: FC<AddMessageFormProps> = (props) => {
  const cn = bem("MessageForm");
  const [message, setMessage] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textRef.current, message);

  const callbacks = {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
      setMessage(e.target.value),
    onSendMessage: () => {
      if (message.trim() && props.connection) {
        props.onSubmit(message);
        setMessage("");
      }
    },
    onSubmit: (e: FormEvent) => {
      e.preventDefault();
      callbacks.onSendMessage();
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if(e.key === "Enter") {
        e.preventDefault();

        if(e.shiftKey) {
          setMessage(message + '\n');
        }
        callbacks.onSendMessage();
      }
    },
  };

  return (
    <div className={cn()}>
      <form onSubmit={callbacks.onSubmit} className={cn('form')}>
        <textarea
          ref={textRef}
          rows={1}
          placeholder={props.labelPlaceholder}
          value={message}
          onChange={callbacks.onChange}
          onKeyDown={callbacks.onKeyDown}
          className={cn("input")}
        ></textarea>
        {message && props.connection && <button type='submit' className={cn("button")}>{props.labelSend}</button>}
      </form>
    </div>
  );
}

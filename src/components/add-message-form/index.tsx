import { ChangeEvent, FC, FormEvent, useCallback, useRef, useState } from "react"
import { cn as bem } from "@bem-react/classname";
import {BsEmojiSmileFill} from 'react-icons/bs';
import useAutoSizeTextArea from "@src/hooks/use-auto-height";
import { AddMessageFormProps } from "./type";
import Picker, { EmojiClickData } from 'emoji-picker-react';
import './style.css'
import { useClickOutside } from "@src/hooks/use-click-outside";

export const AddMessageForm: FC<AddMessageFormProps> = (props) => {
  const cn = bem("MessageForm");
  const [message, setMessage] = useState('');
  const [isEmojiPicker, setisEmojiPicker] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useClickOutside<HTMLDivElement>(() => setisEmojiPicker(false));

  useAutoSizeTextArea(textRef.current, message);

  const callbacks = {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
      setMessage(e.target.value),
    onSendMessage: useCallback(() => {
      if (message.trim() && props.connection) {
        props.onSubmit(message);
        setMessage("");
      }
    }, [message, props.connection]),
    onSubmit: (e: FormEvent) => {
      e.preventDefault();
      callbacks.onSendMessage();
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (e.shiftKey) {
          e.preventDefault();
          setMessage(prev => prev + "\n");
        }
        callbacks.onSendMessage();
      }
    },
    onAddEmoji: (emoji: EmojiClickData) => {
      setMessage(prev => prev + emoji.emoji);
    },
  };

  return (
    <div className={cn()}>
      <form onSubmit={callbacks.onSubmit} className={cn("form")}>
        <div className={cn("emoji")} ref={pickerRef}>
          <BsEmojiSmileFill onClick={() => setisEmojiPicker(!isEmojiPicker)} />
          <Picker
            open={isEmojiPicker}
            className={cn("picker")}
            lazyLoadEmojis={true}
            onEmojiClick={callbacks.onAddEmoji}
          />
        </div>
        <textarea
          ref={textRef}
          rows={1}
          placeholder={props.labelPlaceholder}
          value={message}
          onChange={callbacks.onChange}
          onKeyDown={callbacks.onKeyDown}
          className={cn("input")}
        ></textarea>
        {message.trim() && props.connection && (
          <button type="submit" className={cn("button")}>
            {props.labelSend}
          </button>
        )}
      </form>
    </div>
  );
}

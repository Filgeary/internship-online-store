import { ChangeEvent, memo, useState, KeyboardEvent } from "react";
import s from "./style.module.css";

type InputTextArea = {
  onClick: (value: string) => void;
};

function InputTextArea(props: InputTextArea) {
  const [text, setText] = useState("");

  const callbacks = {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.currentTarget.value);
    },
    sendMessage: () => {
      if (text.trim().replace(/^\s+|\s+$/g, "")) {
        props.onClick(text.trim().replace(/^\s+|\s+$/g, ""));
        setText("");
      }
    },
    onKey: (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") e.preventDefault();
      if (e.key === "Enter" && e.shiftKey) setText(`${text}\n`);
      if (e.key === "Enter" && !e.altKey && !e.ctrlKey && !e.shiftKey)
        callbacks.sendMessage();
    },
  };

  return (
      <div className={s.sendForm}>
        <textarea
          className={s.textarea}
          rows={3}
          value={text}
          onChange={callbacks.onChange}
          onKeyDown={callbacks.onKey}
          placeholder='"Enter" - send message, "shift + Enter" - new line'
        />

        <button className={s.button} onClick={callbacks.sendMessage}>
          Отправить
        </button>
    </div>
  );
}

export default memo(InputTextArea);

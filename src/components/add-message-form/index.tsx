import { ChangeEvent, FC, FormEvent, useState } from "react"
import { cn as bem } from "@bem-react/classname";
import { AddMessageFormProps } from "./type"
import './style.css'

export const AddMessageForm: FC<AddMessageFormProps> = (props) => {
  const cn = bem("MessageForm");
  const [message, setMessage] = useState('');

  const callbacks = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value),
    onSubmit: (e: FormEvent) => {
      e.preventDefault();
      if(message) {
        props.onSubmit(message);
        setMessage('');
      }
    }
  };

  return (
    <div className={cn()}>
      <form onSubmit={callbacks.onSubmit} className={cn('form')}>
        <input
          placeholder={props.labelPlaceholder}
          value={message}
          onChange={callbacks.onChange}
          className={cn("input")}
        ></input>
        {message && <button type='submit' className={cn("button")}>{props.labelSend}</button>}
      </form>
    </div>
  );
}

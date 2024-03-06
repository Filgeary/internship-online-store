import { memo, useMemo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import statusSent from "./status-sent.svg";
import statusDelivered from "./status-delivered.svg";
import sanitize from "sanitize-html";

export interface IChatMessageProps {
  _id?: string;
  title?: string;
  text: string;
  status?: "load" | "sent";
  self: boolean;
  date: Date;
}

function ChatMessage(props: IChatMessageProps) {
  const cn = bem("ChatMessage");

  const options = {
    formattedTime: useMemo(
      () =>
        new Intl.DateTimeFormat("ru", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(props.date),
      [props.date]
    ),
    // formatted: props.date.toLocaleString(undefined, {hour: 'numeric',minute: 'numeric',}),

    status: useMemo(() => {
      switch (props.status) {
        case "load":
          return statusSent;
        case "sent":
          return statusDelivered;
        default:
          if (props.self) {
            return statusDelivered;
          }
          return "";
      }
    }, [props.status]),

    cleanHtml: sanitize(props.text, {
      allowedTags: [ 'b', 'i', 'em', 'a' ],
      allowedAttributes: {
        a: [ 'href' ]
      }
    }),
  };

  return (
    <div className={cn({ self: props.self })}>
      {props.self || <div className={cn("title")}>{props.title}</div>}
      <div className={cn("content")}>
        <span dangerouslySetInnerHTML={{__html: options.cleanHtml}}/>
        <span className={cn("meta")}>
          <span className={cn("time")}>{options.formattedTime}</span>
          <div className={cn("status")}>
            <img src={options.status} />
          </div>
        </span>
      </div>
    </div>
  );
}

export default memo(ChatMessage);

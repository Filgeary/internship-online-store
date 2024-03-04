import { TMessage } from "@src/store/chat-socket/type";
import "./style.css";
import { cn as bem } from "@bem-react/classname";

type TChatMessageProps = {
  item: TMessage;
  incoming?: boolean;
};

const ChatMessage = ({ item, incoming }: TChatMessageProps) => {
  const cn = bem("ChatMessage");
  const date = new Date(item.dateCreate).toLocaleDateString();
  const time = new Date(item.dateCreate).toLocaleTimeString();

  return (
    <>
      {item.text && (
        <div
          className={incoming ? cn() + " " + cn("in") : cn() + " " + cn("out")}
        >
          <div className={cn("header")}>
            <p className={cn("author")}>{`${item.author.profile.name}:`}</p>
            <p className={cn("date")}>{`${date}, ${time}`}</p>
          </div>
          {item.text}
        </div>
      )}
    </>
  );
};

export default ChatMessage;

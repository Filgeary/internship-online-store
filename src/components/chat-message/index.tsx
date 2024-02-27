import { memo } from "react";
import { ChatItemType } from "../../types/chat";
import s from './style.module.css';
import icon from './icon.svg';
import dateFormater from "../../utils/date-format";

type ChatMessagePropsType = {
  item: ChatItemType;
  self?: boolean;
}

const ChatMessage = ({item, self = false}: ChatMessagePropsType) => {

  return (
    <div className={self ? s.ChatMessageSelf : s.ChatMessage} >
      <div className={self ? s.ImageAndTextSelf : s.ImageAndText}>
        <img src={icon}
          alt="user avatar"
        />
        <div className={self ? s.TextSelf : s.Text}>
          <div className={self ? s.UserNameSelf : s.UserName} >
            {item.author.profile.name}
          </div>
          <span className={self ? s.MessageTextSelf : s.MessageText}>
            {item.text}
          </span>
        </div>
      </div>
      <div className={self ? s.CreateTimeSelf : s.CreateTime}>
        {dateFormater(item.dateCreate)}
      </div>
    </div>
  );
};

export default memo(ChatMessage);

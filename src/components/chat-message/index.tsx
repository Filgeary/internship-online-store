import { memo } from "react";
import { ChatItemType } from "../../types/chat";
import s from "./style.module.css";
import icon from "./icon.svg";
import sendind from './send.svg';
import checkmark from './checkmark.svg';
import dateFormater from "../../utils/date-format";
import DOMPurify from "dompurify";

type ChatMessagePropsType = {
  item: ChatItemType;
  self?: boolean;
};

const ChatMessage = ({ item, self = false }: ChatMessagePropsType) => {
  const checks = item.status === 'pending' ? sendind : checkmark;

  const cleanHtml = DOMPurify.sanitize(item.text, {
    ALLOWED_TAGS: ['span', 'b', 'i', 'h1'],
    ALLOWED_ATTR: ['style'],
  })
  return (
    <div className={self ? s.ChatMessageSelf : s.ChatMessage}>
      <div className={self ? s.ImageAndTextSelf : s.ImageAndText}>
        <img src={icon} className={self ? s.UserIconSelf : s.UserIcon} alt="user avatar" />
        <div className={self ? s.TextSelf : s.Text}>
          <div className={self ? s.UserNameSelf : s.UserName}>
            {item.author.profile.name}
          </div>
          <div className={self ? s.MessageTextSelf : s.MessageText} dangerouslySetInnerHTML={ {__html: cleanHtml} } />
          <div className={self ? s.CreateTimeSelf : s.CreateTime}>
            {dateFormater(item.dateCreate)}
            {self && <img src={checks} className={s.StatusIcon} alt="status icon" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);

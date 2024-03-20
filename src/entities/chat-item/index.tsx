import React, {useMemo} from 'react';
import './style.css';
import DOMPurify from 'dompurify';
import CheckSVG from './images/check.svg?react';
import LoadingSVG from './images/loading.svg?react';
import ErrorSVG from './images/error.svg?react';
import {generateUniqueCode} from "@src/shared/utils/unique-code";
import {getLocalTime} from "@src/shared/utils/get-local-time";

function ChatItem({item, myMessage}: {item: Message, myMessage: boolean }) {

  const textFiltered = useMemo(() => DOMPurify.sanitize(item.text, {
    ALLOWED_TAGS: ['b', 'i', 'a'],
    ALLOWED_ATTR: ['href'],
  }), [item.text])

  return (
    <div key={item._key === null ? generateUniqueCode() : item._key} className={'ChatList-item ChatItem' + (myMessage ? ' myMessage' : '')}>
      <div className={'ChatItem-textBody'}>
        <div className={'ChatItem-name'}>
          {item.author.username}
        </div>
        <p className={'ChatItem-text'} dangerouslySetInnerHTML={{__html: textFiltered}}>
        </p>
      </div>
      <div className="ChatItem-information-field">
        <span className="ChatItem-date">{getLocalTime(item.dateCreate).slice(0, 5)}</span>
        <span className={"ChatItem-status" + (item.waiting ? " waiting" : "")}>
                {item.waiting ?
                  <LoadingSVG/>
                  : item.sendingError
                    ? <ErrorSVG/>
                    : <CheckSVG/>}
              </span>
      </div>
    </div>
  );
}

export default ChatItem;

import React, {useEffect, useRef, useState} from 'react';
import './style.css';
import CheckSVG from './check.svg?react';
import LoadingSVG from './loading.svg?react';
import ArrowBottomSVG from './bottom-arrow.svg?react';
import {Message} from "@src/store/chat";
import {getLocalTime} from "@src/utils/get-local-time";
import {generateUniqueCode} from "@src/utils/unique-code";

type ChatList = {
  list: Message[],
  username: string,
  uploadOldMessages: () => void
}

function ChatList({list, username, uploadOldMessages}: ChatList) {
  const intersectionElement = useRef(document.createElement('div'))
  const listRef = useRef(document.createElement('div'))
  const [prevHeightList, setPrevHeightList] = useState(0);
  const [scrollReplacement, setScrollReplacement] = useState(true)
  const [visibilityArrowForScrolling, setVisibilityArrowForScrolling] = useState(false)

  const scrolling = () => {
    setVisibilityArrowForScrolling(listRef.current.scrollHeight - listRef.current.scrollTop > listRef.current.offsetHeight * 2)
  }

  const scrollDown = () => {
    listRef.current?.scrollTo({top: listRef.current.scrollHeight, behavior: 'smooth'})
  }

  useEffect(() => {
    if (list[list.length - 1]?.author?.username === username) scrollDown()
    if (list.length) {
      if(scrollReplacement) {
        listRef.current.scrollTo({top: listRef.current.scrollHeight - prevHeightList})
        setPrevHeightList(listRef.current.scrollHeight)
        setScrollReplacement(false)
      }
      let initialRender = true; // Добавляем флаг для отслеживания первоначальной загрузки
      const observer = new IntersectionObserver((entries) => {
        if (!initialRender) { // Игнорируем первоначальное срабатывание
          if (entries[0].isIntersecting) {
            setScrollReplacement(true)
            uploadOldMessages()
          }
        } else {
          initialRender = false;
        }
      });

      if (intersectionElement.current) observer.observe(intersectionElement.current);
      return () => {
        if (intersectionElement.current) observer.unobserve(intersectionElement.current);
      };
    }
  }, [list]);

  return (
    <div className='ChatList' ref={listRef} onScroll={scrolling}>
      <div className="ChatList-InterSection" ref={intersectionElement}></div>
      {list.map(item =>
          <div key={item._key === null ? generateUniqueCode() : item._key}
               className={'ChatList-item ChatItem' + (username === item.author.username ? ' myMessage' : '')}>
            <div className={'ChatItem-textBody'}>
              <div className={'ChatItem-name'}>
                {item.author.username}
              </div>
              <div className={'ChatItem-text'}>
                {item.text}
              </div>
            </div>
            <div className="ChatItem-information-field">
              <span className="ChatItem-date">{getLocalTime(item.dateCreate).slice(0, 5)}</span>
              <span className={"ChatItem-status" + (item.waiting ? " waiting" : "")}>
                {item.waiting ? <LoadingSVG/> : <CheckSVG/>}
              </span>
            </div>
          </div>)}
      <div className={"ChatList-scrollBottom" + (visibilityArrowForScrolling ? ' visible' : '')} onClick={scrollDown}>
        <ArrowBottomSVG/>
      </div>
    </div>
  );
}

export default ChatList;

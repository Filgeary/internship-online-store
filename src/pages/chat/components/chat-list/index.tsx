import React, {useEffect, useRef, useState} from 'react';
import './style.css';
import ArrowBottomSVG from './bottom-arrow.svg?react';
import {Message} from "@src/ww-old-store-postponed-modals/chat";
import {getLocalTime} from "@src/ww-old-utils-postponed/get-local-time";
import {generateUniqueCode} from "@src/ww-old-utils-postponed/unique-code";
import ChatItem from "@src/ww-old-components-postponed/chat-item";

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
      {list.map(item => (
        <ChatItem item={item} myMessage={item.author.username === username} key={item._key ? item._key : generateUniqueCode()}/>
      ))}
      <div className={"ChatList-scrollBottom" + (visibilityArrowForScrolling ? ' visible' : '')} onClick={scrollDown}>
        <ArrowBottomSVG/>
      </div>
    </div>
  );
}

export default ChatList;

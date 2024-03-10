import React from 'react';
import './style.css';

type message = {
  _id: string,
  key: string,
  text: string
}

function ChatItem(props: message) {
  return (
    <div className={'ChatItem-style'}>

    </div>
  );
}

export default ChatItem;

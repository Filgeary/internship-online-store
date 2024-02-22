import './style.css';

import { cn as bem } from '@bem-react/classname';
import React, { memo } from 'react';

type MessagesTitleProps = {
  children: React.ReactNode;
};

function MessagesTitle(props: MessagesTitleProps) {
  const { children } = props;

  const cn = bem('MessagesTitle');

  return <h3 className={cn()}>{children}</h3>;
}

export default memo(MessagesTitle);

import { cn as bem } from '@bem-react/classname';

import './style.css';

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const cn = bem('ChatLayout');

  return <div className={cn()}>{children}</div>;
};

export default ChatLayout;

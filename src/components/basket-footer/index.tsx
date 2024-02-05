import './style.css';

import React from 'react';
import { cn as bem } from '@bem-react/classname';

type BasketFooterProps = {
  children: React.ReactNode;
};

function BasketFooter({ children }: BasketFooterProps) {
  const cn = bem('BasketFooter');

  return (
    <div className={cn()}>
      {children}
    </div>
  )
}

export default BasketFooter;
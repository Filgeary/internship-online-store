import { cn as bem } from '@bem-react/classname';
import type { PropsWithChildren } from 'react';
import { memo } from "react";

import './style.css';

type Props = {
  head?: React.ReactNode
  footer?: React.ReactNode
} & PropsWithChildren

function PageLayout({ head, footer, children }: Props) {
  const cn = bem('PageLayout');

  return (
    <div className={cn()}>
      <div className={cn('head')}>
        {head}
      </div>
      <div className={cn('center')}>
        {children}
      </div>
      <div className={cn('footer')}>
        {footer}
      </div>
    </div>
  );
}

export default memo(PageLayout);

import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import {PageLayoutProps} from "@src/shared/ui/layout/page-layout/types";
import './style.css';

const PageLayout: React.FC<PageLayoutProps> = ({head, footer, children}) => {

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

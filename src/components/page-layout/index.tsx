import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import { PageLayoutType } from "./type";
import './style.css';



function PageLayout({head, footer, children}: PageLayoutType) {

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

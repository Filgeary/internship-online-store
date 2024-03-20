import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';
import codeGenerator from "@src/shared/utils/code-generator";
import {SideLayoutProps} from "@src/shared/ui/layout/side-layout/types";


const SideLayout: React.FC<SideLayoutProps> = ({children, side, padding}) => {
  const key = codeGenerator()
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding})}>
      {React.Children.map(children, (child) => (
        <div key={key()} className={cn('item')}>{child}</div>
      ))}
    </div>
  );
}

export default memo(SideLayout);

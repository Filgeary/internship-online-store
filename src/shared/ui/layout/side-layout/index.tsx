import React, {memo, ReactElement} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';
import codeGenerator from "@src/ww-old-utils-postponed/code-generator";

type side = 'start' | 'end' | 'between';
type padding = 'small' | 'medium';

interface Props {
  children: React.ReactNode,
  side?: side,
  padding?: padding
}

const SideLayout: React.FC<Props> = ({children, side, padding}) => {
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

import React, {memo, ReactNode} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

interface Props {
    label: string,
    error?: string,
    children: ReactNode
}

const Field: React.FC<Props> = ({label, error, children}) => {
  const cn = bem('Field');
  return (
    <div className={cn()}>
      <label className={cn('label')}>{label}</label>
      <div className={cn('input')}>
        {children}
      </div>
      <div className={cn('error')}>
        {error}
      </div>
    </div>
  )
}

export default memo(Field);

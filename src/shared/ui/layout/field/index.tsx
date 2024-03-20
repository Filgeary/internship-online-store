import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import {FieldProps} from "@src/shared/ui/layout/field/types";
import './style.css';

const Field: React.FC<FieldProps> = ({label, error, children}) => {
  const cn = bem('Field');
  return (
    <div className={cn()}>
      <label className={cn('label')}>{label}</label>
      <div className={cn('input')}>
        {children}
      </div>
      <div className={cn('error')}>
        {error ? error : ''}
      </div>
    </div>
  )
}

export default memo(Field);

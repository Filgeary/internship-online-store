import React from "react";
import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import { FieldPropsType } from "./types";
import './style.css';



function Field({label, error, children}: FieldPropsType) {
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

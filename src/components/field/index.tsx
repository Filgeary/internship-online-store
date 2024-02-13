import React, {memo} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import { IFieldProps } from "./types";
import './style.css';

function Field({label, error, children}: IFieldProps) {
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

Field.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
}

Field.defaultProps = {}

export default memo(Field);

import {memo} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';

import './style.css';

function Button(props) {
  const cn = bem('Button');
  return (
    <button className={cn()} onClick={props.onClick}>{props.value}</button>
  )
}

Button.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

Button.defaultProps = {
  onClick: () => {}
}

export default memo(Button);

import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import './style.css';

function BasketButton(props) {
  const cn = bem('BasketButton');
  return (
    <div  className={cn()}>
      <button onClick={props.onClick}>{props.children}</button>
    </div>
  );
}

BasketButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};

BasketButton.defaultProps = {
  onClick: () => {},
}

export default memo(BasketButton);

import {memo} from "react";
import PropTypes from 'prop-types';
import { ISpinnerProps } from "./types";
import './style.css';

function Spinner({active, children}: ISpinnerProps) {
  if (active) {
    return <div className="Spinner">{children}</div>
  } else {
    return children;
  }
}

Spinner.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

Spinner.defaultProps = {

}

export default memo(Spinner);

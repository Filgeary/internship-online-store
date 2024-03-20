import React, {memo} from "react";
import {SpinnerProps} from "@src/shared/ui/layout/spinner/types";
import './style.css';

const Spinner: React.FC<SpinnerProps> = ({active, children}) => {
  if (active) {
    return <div className="Spinner">{children}</div>
  } else {
    return children;
  }
}

export default memo(Spinner);

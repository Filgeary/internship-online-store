import React, { memo } from "react";
import { SpinnerPropsType } from "./type";
import './style.css';

function Spinner({active, children}: SpinnerPropsType) {
  if (active) {
    return <div className="Spinner">{children}</div>
  } else {
    return children;
  }
}

export default memo(Spinner);

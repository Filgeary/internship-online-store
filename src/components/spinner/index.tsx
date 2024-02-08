import { memo } from "react";
import "./style.css";

type ISpinnerProps = {
  active?: boolean;
  children?: React.ReactNode;
}

function Spinner ({ active, children }:ISpinnerProps)  {
  if (active) {
    return <div className="Spinner">{children}</div>;
  } else {
    return children;
  }
};

/* Spinner.defaultProps = {} */

export default memo(Spinner);

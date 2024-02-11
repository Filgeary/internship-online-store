import { memo } from "react";
import "./style.css";

type TSpinnerProps = {
  active?: boolean;
  children?: React.ReactNode;
}

function Spinner ({ active, children }:TSpinnerProps)  {
  if (active) {
    return <div className="Spinner">{children}</div>;
  } else {
    return children;
  }
};

/* Spinner.defaultProps = {} */

export default memo(Spinner);

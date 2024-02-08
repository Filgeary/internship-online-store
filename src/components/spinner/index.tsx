import { memo} from "react";
import { SpinnerProps } from "./type";
import './style.css';

function Spinner({active, children}: SpinnerProps) {
  if (active) {
    return <div className="Spinner">{children}</div>
  } else {
    return children;
  }
}

export default memo(Spinner);

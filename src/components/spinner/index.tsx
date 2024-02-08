import React, {memo} from "react";
import './style.css';

interface Props {
  active: boolean,
  children: React.ReactNode
}

const Spinner: React.FC<Props> = ({active, children}) => {
  if (active) {
    return <div className="Spinner">{children}</div>
  } else {
    return children;
  }
}

export default memo(Spinner);

import React, {memo} from 'react';
import './style.css'
import {BackdropProps} from "@src/shared/ui/layout/backdrop/types";

// Наложение фона
const Backdrop: React.FC<BackdropProps> = ({isOpen = false, children}) => {
  return isOpen
    ? <div className="backdrop">{children}</div>
    : <>{children}</>;
}

export default memo(Backdrop);

import React, {memo} from 'react';
import './style.css'

interface Props {
  isOpen?: boolean,
  children: React.ReactNode
}
// Наложение фона
const Backdrop: React.FC<Props> = ({isOpen = false, children}) => {
  return isOpen
    ? <div className="backdrop">{children}</div>
    : <>{children}</>;
}

export default memo(Backdrop);

import React, {memo, ReactNode} from "react";
import './style.css';

interface Props {
    title: string,
    children: ReactNode
}

const Head: React.FC<Props> = ({title, children}) => {
  return (
    <div className='Head'>
      <div className='Head-place'>
        <h1 >{title}</h1>
      </div>
      <div className='Head-place'>{children}</div>
    </div>
  )
}

export default memo(Head);

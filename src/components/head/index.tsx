import React, {memo} from "react";
import './style.css';

type HeadProps = {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

function Head({title, children}: HeadProps){
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

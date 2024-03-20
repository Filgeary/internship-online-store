import React, {memo} from "react";
import './style.css';
import {HeadProps} from "@src/shared/ui/layout/head/types";

const Head: React.FC<HeadProps> = ({title, children}) => {
  return (
    <div className='Head'>
      <div className='Head-place'>
        <h1>{title}</h1>
      </div>
      <div className='Head-place'>{children}</div>
    </div>
  )
}

export default memo(Head);

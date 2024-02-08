import {memo} from "react";
import type { HeadProps } from "./type";
import './style.css';

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

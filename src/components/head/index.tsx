import {memo} from "react";
import './style.css';

interface HeadProps {
  title: string;
  children: JSX.Element
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

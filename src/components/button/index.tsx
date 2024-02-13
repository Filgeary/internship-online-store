import {memo} from "react";
import { ButtonPropsType } from "./types";
import './style.css';


function Button({title ,onClick}: ButtonPropsType){
  return (
    <div className='Controls'>
      <button onClick={() => onClick()}>{title}</button>
    </div>
  )
}

export default memo(Button);

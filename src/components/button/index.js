import {memo} from "react";
import { cn as bem } from '@bem-react/classname';
import './style.css';
import CircleSpinner from "../circle-spinner";

function Button({ isLoading, value, ...props }) {
  const cn = bem('Button');

  return (
    <button className={cn()} {...props}>
      {isLoading ? <CircleSpinner /> : value}
      {/*
      // Вариант: лоадер сбоку от текста
      {isLoading && <CircleSpinner />}
      {value}
      */}
    </button>);
}

export default memo(Button);
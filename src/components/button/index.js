import {memo} from "react";
import { cn as bem } from '@bem-react/classname';
import CircleSpinner from "../circle-spinner";
import './style.css';

function Button({ isLoading, value, size, height, ...props }) {
  const cn = bem('Button');

  return (
    <button className={cn({ size, height })} {...props}>
      {isLoading ? <CircleSpinner /> : value}
      {/*
      // Вариант: лоадер сбоку от текста
      {isLoading && <CircleSpinner />}
      {value}
      */}
    </button>);
}

export default memo(Button);
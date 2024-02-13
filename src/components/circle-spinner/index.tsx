import {memo} from "react";
import { cn as bem } from '@bem-react/classname';
import './style.css';

function CircleSpinner() {
  const cn = bem('CircleSpinner');

  return <span className={cn('wrapper')}><span className={cn()}></span></span>;
}

export default memo(CircleSpinner);

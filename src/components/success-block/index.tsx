import './style.css';

import { cn as bem } from '@bem-react/classname';

type SuccessBlockProps = {
  children: string;
};

function SuccessBlock({ children }: SuccessBlockProps) {
  const cn = bem('SuccessBlock');

  return <div className={cn()}>{children}</div>;
}

export default SuccessBlock;

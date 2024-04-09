import './style.css';
import { memo } from 'react';

import { cn as bem } from '@bem-react/classname';

function GlobalLoader() {
  const cn = bem('GlobalLoader');

  return <div className={cn()}>Загрузка...</div>;
}

export default memo(GlobalLoader);

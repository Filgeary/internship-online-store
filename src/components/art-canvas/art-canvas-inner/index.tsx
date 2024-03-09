import './style.css';

import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';

type ArtCanvasInnerProps = {};

function ArtCanvasInner(props: ArtCanvasInnerProps) {
  const cn = bem('ArtCanvasInner');

  return (
    <div className={cn()}>
      <div className={cn('utils')}>
        <div className={cn('utils-row')}>
          <button className={cn('utils-btn')}>Очистить</button>
          <button className={cn('utils-btn')}>Скачать</button>
        </div>
      </div>
      <canvas className={cn('canvas')}></canvas>
    </div>
  );
}

export default memo(ArtCanvasInner);

import './style.css';
import { memo } from 'react';

import { cn as bem } from '@bem-react/classname';

function ArtCanvasOptions() {
  const cn = bem('ArtCanvasOptions');

  return (
    <div className={cn()}>
      <span className={cn('title')}>Настройки</span>

      <div className={cn('row')}>
        <div>
          <span>Цвета:</span>

          <ul className={cn('list')}>
            <li>
              <label>
                Цвет кисточки: &nbsp;
                <input type='color' />
              </label>
            </li>

            <li>
              <label>
                Цвет заднего фона: &nbsp;
                <input type='color' defaultValue='#ffffff' />
              </label>
            </li>
          </ul>
        </div>

        <div>
          <span>Кисть:</span>

          <ul className={cn('list')}>
            <li>
              <label>
                Толщина: &nbsp;
                <input type='number' />
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(ArtCanvasOptions);

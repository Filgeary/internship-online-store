import './style.css';
import React, { memo } from 'react';

import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

function ArtCanvasOptions() {
  const cn = bem('ArtCanvasOptions');

  const { values, callbacks: ctxCallbacks } = useArtCanvasContext();

  const handlers = {
    onBrushColorChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctxCallbacks.setBrushColor(e.target.value);
    },

    onBgColorChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctxCallbacks.setBgColor(e.target.value);
    },

    onBrushWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctxCallbacks.setBrushWidth(Number(e.target.value));
    },

    onFillColorChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctxCallbacks.setFillColor(e.target.checked);
    },
  };

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
                <input
                  value={values.brushColor}
                  onChange={handlers.onBrushColorChange}
                  type='color'
                />
              </label>
            </li>

            <li>
              <label>
                Цвет заднего фона: &nbsp;
                <input value={values.bgColor} onChange={handlers.onBgColorChange} type='color' />
              </label>
            </li>

            <li>
              <label>
                Заливка цветом: &nbsp;
                <input
                  checked={values.fillColor}
                  onChange={handlers.onFillColorChange}
                  type='checkbox'
                />
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
                <input
                  value={values.brushWidth}
                  onChange={handlers.onBrushWidthChange}
                  max={50}
                  type='range'
                />
                {values.brushWidth}
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(ArtCanvasOptions);

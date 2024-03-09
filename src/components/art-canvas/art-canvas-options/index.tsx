import './style.css';
import React, { memo } from 'react';

import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

function ArtCanvasOptions() {
  const cn = bem('ArtCanvasOptions');

  const { brushWidth, setBrushWidth, brushColor, setBrushColor, bgColor, setBgColor } =
    useArtCanvasContext();

  const handlers = {
    onBrushColorChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setBrushColor(e.target.value);
    },

    onBgColorChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setBgColor(e.target.value);
    },

    onBrushWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setBrushWidth(Number(e.target.value));
    },
  };

  console.log(brushColor);

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
                <input value={brushColor} onChange={handlers.onBrushColorChange} type='color' />
              </label>
            </li>

            <li>
              <label>
                Цвет заднего фона: &nbsp;
                <input value={bgColor} onChange={handlers.onBgColorChange} type='color' />
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
                <input value={brushWidth} onChange={handlers.onBrushWidthChange} type='number' />
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(ArtCanvasOptions);

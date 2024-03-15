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

    onZoomingXChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctxCallbacks.setZooming((prevZooming) => ({
        ...prevZooming,
        x: Number(e.target.value),
      }));
    },

    onZoomingYChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctxCallbacks.setZooming((prevZooming) => ({
        ...prevZooming,
        y: Number(e.target.value),
      }));
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
                  min={1}
                  max={50}
                  type='range'
                />
                {values.brushWidth}
              </label>
            </li>
          </ul>
        </div>

        <div>
          <span>Приближение</span>

          <ul className={cn('list')}>
            <li>
              <label>
                Приближение по <b>X</b>:
                <input
                  value={values.zooming.x}
                  onChange={handlers.onZoomingXChange}
                  min={1}
                  max={10}
                  type='range'
                />
                {values.zooming.x}
              </label>
            </li>
            <li>
              <label>
                Приближение по <b>Y</b>:
                <input
                  value={values.zooming.y}
                  onChange={handlers.onZoomingYChange}
                  min={1}
                  max={10}
                  type='range'
                />
                {values.zooming.y}
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(ArtCanvasOptions);

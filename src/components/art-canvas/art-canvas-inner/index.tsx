import './style.css';

import React, { memo, useEffect, useRef, useState } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaTrash, FaEraser } from 'react-icons/fa';
import { TArtImage, TTools } from '@src/store/art/types';

type TCoords = {
  x: number | null;
  y: number | null;
};

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);
  const isDown = useRef<boolean>(false);

  const [startCoords, setStartCoords] = useState<TCoords>({ x: null, y: null });
  const [snapshot, setSnapshot] = useState<ImageData>(null);

  const { values, callbacks: ctxCallbacks } = useArtCanvasContext();

  const callbacks = {
    clearCanvasPicture: () => {
      canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      callbacks.endAction();
    },

    clearCanvas: () => {
      canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      callbacks.endAction();

      ctxCallbacks.resetAllToDefault();
    },

    downloadCanvas: () => {
      // Для заднего фона на загружаемой картинке
      canvasCtx.current.globalCompositeOperation = 'destination-over';
      canvasCtx.current.fillStyle = values.bgColor;
      canvasCtx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.current.globalCompositeOperation = 'source-over';

      canvasRef.current.toBlob((blob) => {
        const image = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = image;
        link.download = 'canvas_image.jpg';
        link.click();
      });
    },

    endAction: () => {
      canvasRef.current.toBlob((blob) => {
        const image = new Image(canvasRef.current.width, canvasRef.current.height) as TArtImage;
        image.src = URL.createObjectURL(blob);

        const nextActiveImage = values.activeImage + 1;
        const nextImages = [...values.images.slice(0, values.activeImage + 1), image];

        ctxCallbacks.setImages(nextImages);
        ctxCallbacks.setActiveImage(nextActiveImage);
      });

      canvasCtx.current.closePath();
      isDown.current = false;
    },

    undo: () => {
      ctxCallbacks.setActiveImage(Math.max(values.activeImage - 1, 0));
    },

    redo: () => {
      ctxCallbacks.setActiveImage(Math.min(values.activeImage + 1, values.images.length - 1));
    },

    clearImages: () => {
      const newImages = [...values.images];
      newImages.length = 1;

      ctxCallbacks.setActiveImage(0);
      ctxCallbacks.setImages(newImages);
    },

    eraserToggle: () => ctxCallbacks.setEraserActive(!values.eraserActive),
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) {
        const { offsetX, offsetY } = e.nativeEvent;
        setStartCoords({
          x: offsetX,
          y: offsetY,
        });
        setSnapshot(
          canvasCtx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        );

        canvasCtx.current.beginPath();
        isDown.current = true;
      }
    },

    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isDown.current) {
        const { offsetX, offsetY } = e.nativeEvent;

        canvasCtx.current.putImageData(snapshot, 0, 0);

        if (values.eraserActive) {
          canvasCtx.current.lineWidth = values.brushWidth;
          canvasCtx.current.lineCap = 'round';
          canvasCtx.current.globalCompositeOperation = 'destination-out';
          // При переключении заднего фона - останется таким же
          canvasCtx.current.strokeStyle = values.bgColor;
          canvasCtx.current.lineTo(offsetX, offsetY);
          canvasCtx.current.stroke();

          canvasCtx.current.globalCompositeOperation = 'source-over';

          return;
        }

        switch (values.activeTool) {
          case 'brush': {
            canvasCtx.current.lineWidth = values.brushWidth;
            canvasCtx.current.lineCap = 'round';
            canvasCtx.current.strokeStyle = values.brushColor;
            canvasCtx.current.lineTo(offsetX, offsetY);
            canvasCtx.current.stroke();
            break;
          }

          case 'square': {
            if (!values.fillColor) {
              canvasCtx.current.lineWidth = values.brushWidth;
              canvasCtx.current.strokeStyle = values.brushColor;
              canvasCtx.current.strokeRect(
                offsetX,
                offsetY,
                startCoords.x - offsetX,
                startCoords.y - offsetY
              );
            } else {
              canvasCtx.current.fillStyle = values.brushColor;
              canvasCtx.current.fillRect(
                offsetX,
                offsetY,
                startCoords.x - offsetX,
                startCoords.y - offsetY
              );
            }
            break;
          }

          case 'circle': {
            canvasCtx.current.beginPath();
            canvasCtx.current.fillStyle = values.brushColor;
            canvasCtx.current.lineWidth = values.brushWidth;

            const radius = Math.sqrt(
              Math.pow(startCoords.x - offsetX, 2) + Math.pow(startCoords.y - offsetY, 2)
            );
            canvasCtx.current.arc(startCoords.x, startCoords.y, radius, 0, 2 * Math.PI);

            if (values.fillColor) canvasCtx.current.fill();
            else canvasCtx.current.stroke();

            break;
          }

          case 'triangle': {
            canvasCtx.current.beginPath();
            canvasCtx.current.fillStyle = values.brushColor;
            canvasCtx.current.lineWidth = values.brushWidth;

            canvasCtx.current.moveTo(startCoords.x, startCoords.y);
            canvasCtx.current.lineTo(offsetX, offsetY);
            // Нижняя линия треугольника
            canvasCtx.current.lineTo(startCoords.x * 2 - offsetX, offsetY);
            canvasCtx.current.closePath();

            if (values.fillColor) canvasCtx.current.fill();
            else canvasCtx.current.stroke();

            break;
          }
        }
      }
    },

    onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) {
        callbacks.endAction();
      }
    },

    onPointerOut: () => {
      if (isDown.current) {
        callbacks.endAction();
      }
    },

    onActiveToolChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      ctxCallbacks.setActiveTool(e.target.value as TTools);
    },
  };

  const options = {
    leftMouseBtn: 0,
    undoDisabled: values.activeImage === 0,
    redoDisabled: values.activeImage === values.images.length - 1,
    clearImagesDisabled: values.images.length === 1,
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.code) {
          case 'KeyZ': {
            callbacks.undo();
            break;
          }
          case 'KeyY': {
            callbacks.redo();
            break;
          }
        }
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [values.images, values.activeImage, callbacks.undo, callbacks.redo]);

  useEffect(() => {
    canvasCtx.current = canvasRef.current.getContext('2d');
    if (values.images.length) return;

    const ctx = canvasCtx.current;

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasRef.current.toBlob((blob) => {
      console.log('here');
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      ctxCallbacks.setImages([...values.images, image]);
    });
  }, []);

  useEffect(() => {
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
  }, []);

  useEffect(() => {
    canvasRef.current.style.setProperty('background-color', values.bgColor);
  }, [values.bgColor]);

  useEffect(() => {
    if (!canvasCtx.current) return;

    const imageNode = values.images[values.activeImage];

    if (!imageNode) return;

    if (!imageNode.loaded) {
      imageNode.onload = () => {
        canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.current.drawImage(imageNode, 0, 0);

        imageNode.loaded = true;
      };
    } else {
      canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.current.drawImage(imageNode, 0, 0);
    }
  }, [values.images, values.activeImage]);

  useEffect(() => {
    console.log('Values images:', values.images);
  }, [values.images]);

  return (
    <div className={cn()}>
      <div className={cn('utils')}>
        <div className={cn('utils-row')}>
          <div className={cn('utils-left')}>
            <button
              onClick={callbacks.undo}
              disabled={options.undoDisabled}
              className={cn('utils-btn')}
              title={'Назад'}
            >
              <FaArrowAltCircleLeft size={20} />
            </button>
            <button
              onClick={callbacks.redo}
              disabled={options.redoDisabled}
              className={cn('utils-btn')}
              title={'Вперёд'}
            >
              <FaArrowAltCircleRight size={20} />
            </button>
            <button
              onClick={callbacks.clearImages}
              disabled={options.clearImagesDisabled}
              className={cn('utils-btn')}
              title={'Удалить шаги'}
            >
              <FaTrash size={20} />
            </button>

            <div className={cn('separate-util')}>
              <button title={'Стёрка'} onClick={callbacks.eraserToggle} className={cn('utils-btn')}>
                <FaEraser color={values.eraserActive ? 'green' : 'black'} size={20} />
              </button>
            </div>
          </div>

          <div className={cn('utils-center')}>
            <select onChange={handlers.onActiveToolChange} className={cn('utils-select')}>
              <option value={'brush'}>Кисть</option>
              <option value={'square'}>Прямоугольник</option>
              <option value={'circle'}>Круг</option>
              <option value={'triangle'}>Треугольник</option>
            </select>
          </div>

          <div className={cn('utils-right')}>
            <button className={cn('utils-btn')} onClick={callbacks.clearCanvas}>
              Сбросить всё
            </button>
            <button className={cn('utils-btn')} onClick={callbacks.clearCanvasPicture}>
              Очистить рисунок
            </button>
            <button
              disabled={!values.canSave}
              className={cn('utils-btn')}
              onClick={callbacks.downloadCanvas}
            >
              Скачать
            </button>
          </div>
        </div>
      </div>
      <canvas
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerUp={handlers.onPointerUp}
        onPointerOut={handlers.onPointerOut}
        ref={canvasRef}
        className={cn('canvas')}
      />
    </div>
  );
}

export default memo(ArtCanvasInner);

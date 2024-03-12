import './style.css';

import React, { memo, useEffect, useRef, useState } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

import { TArtImage, TTools } from '@src/store/art/types';
import ArtCanvasUtils from '../art-canvas-utils';
import ArtManager, { artManager } from '../manager';

type TCoords = {
  x: number | null;
  y: number | null;
};

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);
  const canvasManager = useRef<ArtManager>(artManager);
  const isDown = useRef<boolean>(false);

  const [startCoords, setStartCoords] = useState<TCoords>({ x: null, y: null });
  const [snapshot, setSnapshot] = useState<ImageData>(null);

  const { values, callbacks: ctxCallbacks } = useArtCanvasContext();

  const callbacks = {
    clearCanvasPicture: () => {
      canvasManager.current.clearCanvasPicture();
      callbacks.endAction();
    },

    clearCanvas: () => {
      canvasManager.current.clearCanvasPicture();
      callbacks.endAction();

      ctxCallbacks.resetAllToDefault();
    },

    downloadCanvas: () => {
      canvasManager.current.downloadCanvas(values.bgColor);
    },

    endAction: () => {
      canvasManager.current.getBinary().then((blob) => {
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

  // Инициализация менеджера
  useEffect(() => {
    canvasManager.current.init(canvasRef.current, canvasRef.current.getContext('2d'));
  }, []);

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
    if (values.images.length) return;

    canvasManager.current.fillBgOpacityColor();

    canvasManager.current.getBinary().then((blob) => {
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      ctxCallbacks.setImages([...values.images, image]);
    });
  }, []);

  useEffect(() => {
    canvasCtx.current = canvasRef.current.getContext('2d');
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

  return (
    <>
      <div className={cn()}>
        <ArtCanvasUtils
          undoAction={callbacks.undo}
          isUndoDisabled={options.undoDisabled}
          redoAction={callbacks.redo}
          isRedoDisabled={options.redoDisabled}
          clearImages={callbacks.clearImages}
          isClearImagesDisabled={options.clearImagesDisabled}
          activeToolChangeAction={handlers.onActiveToolChange}
          clearCanvas={callbacks.clearCanvas}
          clearCanvasPicture={callbacks.clearCanvasPicture}
          downloadAction={callbacks.downloadCanvas}
          isCanSave={values.canSave}
          eraserToggle={callbacks.eraserToggle}
          isEraserActive={values.eraserActive}
        />
        <canvas
          onPointerDown={handlers.onPointerDown}
          onPointerMove={handlers.onPointerMove}
          onPointerUp={handlers.onPointerUp}
          onPointerOut={handlers.onPointerOut}
          ref={canvasRef}
          className={cn('canvas')}
        />
      </div>
      <hr />
    </>
  );
}

export default memo(ArtCanvasInner);

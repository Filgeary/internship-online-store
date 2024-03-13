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
      canvasManager.current
        .getImage(canvasRef.current.width, canvasRef.current.height)
        .then((image: TArtImage) => {
          const nextActiveImage = values.activeImage + 1;
          const nextImages = [...values.images.slice(0, values.activeImage + 1), image];

          ctxCallbacks.setImages(nextImages);
          ctxCallbacks.setActiveImage(nextActiveImage);
        });

      canvasManager.current.closePath();
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
        setSnapshot(canvasManager.current.getImageData());

        canvasManager.current.beginPath();
        isDown.current = true;
      }
    },

    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isDown.current) {
        const { offsetX, offsetY } = e.nativeEvent;

        canvasManager.current.putImageData(snapshot, 0, 0);

        if (values.eraserActive) {
          canvasManager.current.fillEraser({
            width: values.brushWidth,
            bgColor: values.bgColor,
            x: offsetX,
            y: offsetY,
          });

          return;
        }

        canvasManager.current.draw(values.activeTool, {
          brushWidth: values.brushWidth,
          brushColor: values.brushColor,
          x: offsetX,
          y: offsetY,
          isFilled: values.fillColor,
          startCoords,
        });
      }
    },

    onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) callbacks.endAction();
    },

    onPointerOut: () => {
      if (isDown.current) callbacks.endAction();
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
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
  }, []);

  useEffect(() => {
    canvasRef.current.style.setProperty('background-color', values.bgColor);
  }, [values.bgColor]);

  useEffect(() => {
    if (!canvasManager.current.isInited) return;

    const imageNode = values.images[values.activeImage];
    if (!imageNode) return;

    if (!imageNode.loaded) {
      imageNode.onload = () => {
        canvasManager.current.clearAndDrawImage(imageNode);

        imageNode.loaded = true;
      };
    } else canvasManager.current.clearAndDrawImage(imageNode);
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

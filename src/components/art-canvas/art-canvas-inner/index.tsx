import './style.css';

import React, { memo, useEffect, useRef, useState } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

import { TArtImage, TTools } from '@src/store/art/types';
import ArtCanvasUtils from '../art-canvas-utils';
import ArtManager, { artManager } from '../manager';
import Square from '../shapes/square';
import { TShapeOptions } from '../shapes/types';

type TCoords = {
  x: number | null;
  y: number | null;
};

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');

  const { values, callbacks: ctxCallbacks } = useArtCanvasContext();
  const canvasConfig: TShapeOptions = {
    brushColor: values.brushColor,
    brushWidth: values.brushWidth,
    isFilled: values.fillColor,
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);
  const canvasManager = useRef<ArtManager>(artManager);

  const [startCoords, setStartCoords] = useState<TCoords>({ x: null, y: null });
  const [snapshot, setSnapshot] = useState<ImageData>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [shapes, setShapes] = useState<Square[]>([]);

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
      setIsPointerDown(false);

      // if (isCtrlPressed) return;

      canvasManager.current
        .getImage(canvasRef.current.width, canvasRef.current.height)
        .then((image: TArtImage) => {
          const nextActiveImage = values.activeImage + 1;
          const nextImages = [...values.images.slice(0, values.activeImage + 1), image];

          ctxCallbacks.setImages(nextImages);
          ctxCallbacks.setActiveImage(nextActiveImage);
        });
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
      setShapes([]);
    },

    eraserToggle: () => ctxCallbacks.setEraserActive(!values.eraserActive),
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) {
        setIsPointerDown(true);

        const { offsetX, offsetY } = e.nativeEvent;
        setStartCoords({
          x: offsetX,
          y: offsetY,
        });

        if (isCtrlPressed) return;
        setSnapshot(canvasManager.current.getImageData());
      }
    },

    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isPointerDown) {
        if (isCtrlPressed || !snapshot) return;

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

        if (isCtrlPressed) {
          return;
        }

        canvasManager.current.draw(values.activeTool, {
          bgColor: values.bgColor,
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
      if (e.button === options.leftMouseBtn) {
        /* 
          Если нет снапшота - пользователь сначала двигал с помощью Ctrl + ЛКМ,
          а потом отпустил Ctrl 
        */
        if (!snapshot) {
          setIsPointerDown(false);
          return;
        }

        const { offsetX, offsetY } = e.nativeEvent;

        if (values.activeTool !== 'brush' && !values.eraserActive) {
          const shape = canvasManager.current.draw(values.activeTool, {
            brushWidth: values.brushWidth,
            brushColor: values.brushColor,
            x: offsetX,
            y: offsetY,
            isFilled: values.fillColor,
            startCoords,
          }) as Square;

          setShapes([...shapes, shape]);
        }

        callbacks.endAction();
        setSnapshot(null);
      }
    },

    onPointerOut: () => {
      if (isPointerDown) callbacks.endAction();
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
    if (!isCtrlPressed || values.eraserActive) return;

    const shapeSelected = shapes
      .slice()
      .reverse()
      .find((shape) => shape.mouseIn(startCoords));
    if (!shapeSelected) return;

    const pointerMoveHandler = (e: PointerEvent) => {
      shapeSelected.options.x += e.movementX;
      shapeSelected.options.y += e.movementY;
      shapeSelected.options.startCoords.x += e.movementX;
      shapeSelected.options.startCoords.y += e.movementY;

      canvasManager.current.clearCanvasPicture();

      shapes.forEach((shape) => shape.draw());
    };

    const pointerUpHandler = () => {
      setStartCoords({ x: null, y: null });
      callbacks.endAction();
      canvasRef.current.removeEventListener('pointermove', pointerMoveHandler);
    };

    canvasRef.current.addEventListener('pointermove', pointerMoveHandler);
    canvasRef.current.addEventListener('pointerup', pointerUpHandler);

    return () => {
      canvasRef.current.removeEventListener('pointermove', pointerMoveHandler);
      canvasRef.current.removeEventListener('pointerup', pointerUpHandler);
    };
  }, [startCoords, isPointerDown, values.eraserActive]);

  // Инициализация менеджера
  useEffect(() => {
    canvasManager.current.init(canvasRef.current, canvasRef.current.getContext('2d'));
  }, []);

  // Синхронизация нажатий и начала рисунка
  useEffect(() => {
    if (isPointerDown) canvasManager.current.beginPath();
    else canvasManager.current.closePath();
  }, [isPointerDown]);

  // Логика нажатий кнопок на клавиатуре
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
          default: {
            if (e.repeat) return;
            setIsCtrlPressed(true);
          }
        }
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.code === 'ControlLeft') {
        setIsCtrlPressed(false);
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [values.images, values.activeImage, callbacks.undo, callbacks.redo]);

  // Логика смены курсора для состояний ctrl
  useEffect(() => {
    if (isCtrlPressed) {
      if (isPointerDown) canvasRef.current.style.setProperty('cursor', 'grabbing');
      else canvasRef.current.style.setProperty('cursor', 'grab');
    } else {
      canvasRef.current.style.setProperty('cursor', null);
    }
  }, [isCtrlPressed, isPointerDown]);

  // Инициализация правильных размеров канвы
  useEffect(() => {
    canvasCtx.current = canvasRef.current.getContext('2d');

    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
  }, []);

  // Смена цвета заднего фона
  useEffect(() => {
    canvasRef.current.style.setProperty('background-color', values.bgColor);
  }, [values.bgColor]);

  // Инициализация видимого полотна
  useEffect(() => {
    if (values.images.length) return;

    canvasManager.current.fillBgOpacityColor();

    canvasManager.current.getBinary().then((blob) => {
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      ctxCallbacks.setImages([...values.images, image]);
    });
  }, []);

  // Рисование изображений по соответствующему индексу
  useEffect(() => {
    if (!canvasManager.current.isInited) return;

    const imageNode = values.images[values.activeImage];
    console.log(imageNode, imageNode?.src, values.activeImage);
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

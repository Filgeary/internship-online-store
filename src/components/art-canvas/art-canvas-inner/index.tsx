import './style.css';

import React, { memo, useEffect, useRef, useState } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

import { TArtImage, TTools } from '@src/store/art/types';
import ArtCanvasUtils from '../art-canvas-utils';
import ArtManager, { artManager } from '../manager';
import { TShapes } from '../shapes/types';
import doShapeCopy from '../utils/do-shape-copy';
import cloneDeep from 'lodash.clonedeep';

type TCoords = {
  x: number | null;
  y: number | null;
};

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');

  const { values, callbacks: ctxCallbacks } = useArtCanvasContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);
  const canvasManager = useRef<ArtManager>(artManager);

  const [startCoords, setStartCoords] = useState<TCoords>({ x: null, y: null });
  const [snapshot, setSnapshot] = useState<ImageData>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);

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

    endAction: (selectedShapeId?: string) => {
      setIsPointerDown(false);

      // if (isCtrlPressed) return;

      canvasManager.current
        .getImage(canvasRef.current.width, canvasRef.current.height)
        .then((image: TArtImage) => {
          const nextActiveImage = values.activeImage + 1;
          const nextImages = [...values.images.imagesNodes.slice(0, values.activeImage + 1), image];

          ctxCallbacks.setImagesNodes(nextImages);
          ctxCallbacks.setActiveImage(nextActiveImage);

          if (!selectedShapeId) return;
          const shapeInstance = values.images.shapes.find((shape) => shape.id === selectedShapeId);
          if (!shapeInstance) return;

          const shapeCopy = doShapeCopy(shapeInstance);
          const shapesStepCopy = [
            ...values.images.shapes.filter((shape) => shape.id !== shapeCopy.id),
            shapeCopy,
          ];
          const shapesHistoryCopy = [...values.images.shapesHistory, shapesStepCopy];

          ctxCallbacks.setShapesHistory(shapesHistoryCopy);

          console.log(selectedShapeId);
          console.log('Здесь', shapeInstance);
        });
    },

    undo: () => {
      ctxCallbacks.setActiveImage(Math.max(values.activeImage - 1, 0));
    },

    redo: () => {
      ctxCallbacks.setActiveImage(
        Math.min(values.activeImage + 1, values.images.imagesNodes.length - 1)
      );
    },

    clearImages: () => {
      const newImages = [...values.images.imagesNodes];
      newImages.length = 1;

      ctxCallbacks.setActiveImage(0);
      ctxCallbacks.setImages({
        imagesNodes: newImages,
        shapes: [],
        shapesHistory: [],
      });
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
        const { offsetX, offsetY } = e.nativeEvent;

        /* 
          Если нет снапшота - пользователь сначала двигал с помощью Ctrl + ЛКМ,
          а потом отпустил Ctrl 
        */
        if (!snapshot) {
          setIsPointerDown(false);
          return;
        }

        if (values.activeTool !== 'brush' && !values.eraserActive) {
          /*
           Пользователь нарисовал новую фигуру
           Рисуем её и заносим в историю
          */
          const shape = canvasManager.current.draw(values.activeTool, {
            brushWidth: values.brushWidth,
            brushColor: values.brushColor,
            x: offsetX,
            y: offsetY,
            isFilled: values.fillColor,
            startCoords,
          }) as TShapes;

          ctxCallbacks.setShapes([...values.images.shapes, shape]);
          // OK
          const shapeCopy = doShapeCopy(shape);
          const shapeStepCopy = [
            ...values.images.shapes.filter((shape) => shape.id !== shapeCopy.id),
            shapeCopy,
          ];
          const allShapesCopy = [...values.images.shapesHistory, shapeStepCopy];

          ctxCallbacks.setShapesHistory(allShapesCopy);
        }

        if (snapshot) {
          callbacks.endAction();
          setSnapshot(null);
        }
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
    redoDisabled: values.activeImage === values.images.imagesNodes.length - 1,
    clearImagesDisabled: values.images.imagesNodes.length === 1,
  };

  // Логика перетаскивания фигур
  useEffect(() => {
    if (!isCtrlPressed || values.eraserActive) return;

    const shapeSelected = values.images.shapes
      .slice()
      .reverse()
      .find((shape) => shape.mouseIn(startCoords));
    if (!shapeSelected) return;
    setSelectedShapeId(shapeSelected.id);

    const pointerMoveHandler = (e: PointerEvent) => {
      shapeSelected.options.x += e.movementX;
      shapeSelected.options.y += e.movementY;
      shapeSelected.options.startCoords.x += e.movementX;
      shapeSelected.options.startCoords.y += e.movementY;

      canvasManager.current.clearCanvasPicture();

      values.images.shapes.forEach((shape) => shape.draw());
    };

    const pointerUpHandler = () => {
      setStartCoords({ x: null, y: null });
      callbacks.endAction(shapeSelected.id);
      canvasRef.current.removeEventListener('pointermove', pointerMoveHandler);
    };

    canvasRef.current.addEventListener('pointermove', pointerMoveHandler);
    canvasRef.current.addEventListener('pointerup', pointerUpHandler);

    return () => {
      canvasRef.current.removeEventListener('pointermove', pointerMoveHandler);
      canvasRef.current.removeEventListener('pointerup', pointerUpHandler);
    };
  }, [startCoords, isPointerDown, values.eraserActive, values.images.shapes]);

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
      setSelectedShapeId(null);
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
    if (values.images.imagesNodes.length) return;

    canvasManager.current.fillBgOpacityColor();

    canvasManager.current.getBinary().then((blob) => {
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      ctxCallbacks.setImagesNodes([...values.images.imagesNodes, image]);
    });
  }, []);

  // Рисование динамических фигур
  useEffect(() => {
    const shapesHistoryStep = values.images.shapesHistory[values.activeImage - 1];
    if (!shapesHistoryStep?.length) return;

    ctxCallbacks.setShapes(cloneDeep(shapesHistoryStep));
    ctxCallbacks.setShapesHistory(values.images.shapesHistory.slice(0, values.activeImage));
  }, [values.activeImage]);

  // Рисование изображений по соответствующему индексу
  useEffect(() => {
    if (!canvasManager.current.isInited) return;

    const imageNode = values.images.imagesNodes[values.activeImage];

    if (!imageNode) return;

    if (!imageNode.loaded) {
      imageNode.onload = () => {
        canvasManager.current.clearAndDrawImage(imageNode);

        imageNode.loaded = true;
      };
    } else canvasManager.current.clearAndDrawImage(imageNode);
  }, [values.images.imagesNodes, values.activeImage]);

  useEffect(() => {
    if (!canvasCtx.current) return;

    const ratio = Math.min(
      canvasRef.current.clientWidth / canvasRef.current.width,
      canvasRef.current.clientHeight / canvasRef.current.height
    );
    canvasCtx.current.scale(ratio, ratio);
  }, [values.zooming]);

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
          activeTool={values.activeTool}
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

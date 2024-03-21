import './style.css';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';
import cloneDeep from 'lodash.clonedeep';

import ArtCanvasUtils from '../art-canvas-utils';
import ArtManager from '../manager';

import doShapeCopy from '../utils/do-shape-copy';

import { TTools } from '@src/store/art/types';
import { TShapes } from '../shapes/types';

type TCoords = {
  x: number | null;
  y: number | null;
};

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');

  const { values, callbacks: ctxCallbacks } = useArtCanvasContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasManager = useMemo<ArtManager>(() => new ArtManager(), []);

  const [startCoords, setStartCoords] = useState<TCoords>({ x: null, y: null });
  const [snapshot, setSnapshot] = useState<ImageData>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Panning
  const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });

  const callbacks = {
    clearCanvas: () => canvasManager.clearCanvasAndResetAll(),
    downloadCanvas: () => canvasManager.downloadCanvas(),
    undo: () => canvasManager.undo(),
    redo: () => canvasManager.redo(),
    clearImages: () => canvasManager.clearImages(),
    eraserToggle: () => canvasManager.eraserToggle(),
    bucketToggle: () => canvasManager.bucketToggle(),
    zoomAction: (delta: number) => canvasManager.zoomAction(delta),

    clearCanvasPicture: () => {
      canvasManager.clearCanvasPicture();
      callbacks.endAction();
    },

    endAction: (selectedShapeId?: string) => {
      setIsPointerDown(false);
      setStartCoords({ x: null, y: null });
      canvasManager.endAction(selectedShapeId);
    },

    drawShape: (offsetX: number, offsetY: number) => {
      let resultShape = null;
      let resultArea = null;

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
        resultShape = canvasManager.getInstance(values.activeTool, {
          brushWidth: values.brushWidth,
          brushColor: values.brushColor,
          x: offsetX - values.panOffset.x,
          y: offsetY - values.panOffset.y,
          isFilled: values.fillColor,
          startCoords: {
            x: startCoords.x,
            y: startCoords.y,
          },
          initialCoords: {
            x: offsetX - values.panOffset.x,
            y: offsetY - values.panOffset.y,
            startCoords: {
              x: startCoords.x - values.panOffset.x,
              y: startCoords.y - values.panOffset.y,
            },
          },
          panOffset: values.panOffset,
        }) as TShapes;
        resultArea = resultShape.getArea();
        if (resultArea >= options.minArea) canvasManager.updateShapes(resultShape);
        else canvasManager.makeVisibleAllShapes();
      }

      if (snapshot) {
        if (resultArea >= options.minArea) callbacks.endAction();
        setIsPointerDown(false);
        setSnapshot(null);
      }
    },
  };

  const helpers = {
    getMouseCoordinates: (e: PointerEvent) => {
      const clientX =
        (e.offsetX - values.panOffset.x * values.scale + values.scaleOffset.x) / values.scale;
      const clientY =
        (e.offsetY - values.panOffset.y * values.scale + values.scaleOffset.y) / values.scale;
      return { clientX, clientY };
    },
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) {
        setIsPointerDown(true);

        const { clientX, clientY } = helpers.getMouseCoordinates(e.nativeEvent);
        setStartCoords({
          x: clientX,
          y: clientY,
        });

        if (values.bucketActive) return;

        ctxCallbacks.setShapesHistory(values.images.shapesHistory.slice(0, values.activeImage));

        if (isCtrlPressed) return;
        if (isSpacePressed) {
          setStartPanMousePosition({ x: clientX, y: clientY });
          return;
        }

        setSnapshot(canvasManager.getImageData());
      }
    },

    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isPointerDown) {
        const { offsetX, offsetY } = e.nativeEvent;
        const { clientX: xWithOffset, clientY: yWithOffset } = helpers.getMouseCoordinates(
          e.nativeEvent
        );

        canvasManager.inDrawingProcess(snapshot, {
          isCtrlPressed,
          isPanning: isSpacePressed,
          startX: startCoords.x,
          startY: startCoords.y,
          startPanX: startPanMousePosition.x,
          startPanY: startPanMousePosition.y,
          x: offsetX - values.panOffset.x,
          y: offsetY - values.panOffset.y,
          xWithOffset,
          yWithOffset,
        });
      }
    },

    onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) {
        const { offsetX, offsetY } = e.nativeEvent;

        callbacks.drawShape(offsetX, offsetY);
      }
    },

    onPointerOut: (e: React.PointerEvent) => {
      const { offsetX, offsetY } = e.nativeEvent;
      callbacks.drawShape(offsetX, offsetY);
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
    percentScaleFormat: new Intl.NumberFormat('ru-RU', { style: 'percent' }).format(values.scale),
    minArea: 150,
  };

  // Логика перетаскивания фигур
  useEffect(() => {
    if ((!isCtrlPressed || values.eraserActive) && !values.bucketActive) return;

    const shapeSelected = values.images.shapes.findLast((shape) => {
      return shape.mouseIn(startCoords);
    });

    if (!shapeSelected) return;

    // Если активна заливка - только заливаем
    if (values.bucketActive) {
      console.log(
        `Заливаю ${shapeSelected.id} цветом %c${values.brushColor}`,
        `background: ${values.brushColor}`
      );
      shapeSelected.fillArea(
        values.brushColor,
        { x: values.panOffset.x, y: values.panOffset.y },
        values.scale
      );
    }

    const pointerMoveHandler = (e: PointerEvent) => {
      const { movementX, movementY } = e;

      canvasManager.onPointerMove(shapeSelected, movementX, movementY);
      canvasManager.clearCanvasPicture();
      values.images.shapes.forEach((shape) => canvasManager.drawByOffsets(shape));
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
  }, [
    startCoords,
    isPointerDown,
    values.eraserActive,
    values.images.shapes,
    values.panOffset,
    values.bucketActive,
  ]);

  // Инициализация менеджера
  useEffect(() => {
    canvasManager.init(
      canvasRef.current,
      canvasRef.current.getContext('2d', {
        willReadFrequently: true,
      }),
      ctxCallbacks,
      values
    );
  }, []);

  // Обновление экшнов менеджера
  useEffect(() => {
    canvasManager.update(ctxCallbacks, values);
  }, [ctxCallbacks, values]);

  // Синхронизация нажатий и начала рисунка
  useEffect(() => {
    if (isPointerDown) canvasManager.beginPath();
    else canvasManager.closePath();
  }, [isPointerDown]);

  // Логика нажатий кнопок на клавиатуре
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.code) {
          case 'KeyZ':
            return callbacks.undo();
          case 'KeyY':
            return callbacks.redo();
          default: {
            if (e.repeat) return;
            setIsCtrlPressed(true);
          }
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ControlLeft':
          return setIsCtrlPressed(false);
        case 'Space':
          return setIsSpacePressed(false);
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

  // Смена цвета заднего фона
  useEffect(() => {
    canvasRef.current.style.setProperty('background-color', values.bgColor);
  }, [values.bgColor]);

  // Установка динамических фигур (чтобы можно было перетаскивать в любой момент)
  useEffect(() => {
    const shapesHistoryStep = values.images.shapesHistory[values.activeImage - 1];
    if (!shapesHistoryStep?.length) return;

    ctxCallbacks.setShapes(cloneDeep(shapesHistoryStep));
  }, [values.activeImage]);

  // Отрисовка примитивов (в том числе учитывается текущий шаг истории)
  useEffect(() => {
    canvasManager.makeVisibleAllShapes();
  }, [values.panOffset, values.scale, values.activeImage]);

  // Panning-фича (можем передвигаться по холсту)
  useEffect(() => {
    const panFunction = (e: WheelEvent) => {
      const { x, y } = e;
      const element = document.elementFromPoint(x, y);
      if (element !== canvasRef.current) return;

      e.preventDefault();

      // Горизонтальный скролл
      if (e.ctrlKey || e.metaKey) {
        ctxCallbacks.setPanOffset({
          ...values.panOffset,
          x: values.panOffset.x - e.deltaY,
        });
      } else {
        ctxCallbacks.setPanOffset({
          x: values.panOffset.x - e.deltaX,
          y: values.panOffset.y - e.deltaY,
        });
      }
    };

    document.addEventListener('wheel', panFunction, { passive: false });

    return () => document.removeEventListener('wheel', panFunction);
  }, [values.panOffset]);

  // Анимация падения
  useEffect(() => {
    let frameId: number | null = null;

    const loop = () => {
      values.images.shapes.forEach((shape) => {
        shape.options.y += 1;
        shape.options.startCoords.y += 1;
        shape.options.initialCoords.y += 1;

        return shape;
      });

      canvasManager.clearCanvasPicture();
      values.images.shapes.forEach((shape) => canvasManager.polyDraw(shape));

      frameId = requestAnimationFrame(loop);
    };

    if (values.isFalling) loop();

    return () => {
      if (!frameId) return;

      cancelAnimationFrame(frameId);

      const shapesDeepCopy = values.images.shapes.map(doShapeCopy);
      const shapesHistoryCopy = [...values.images.shapesHistory, shapesDeepCopy];

      ctxCallbacks.setShapes(shapesDeepCopy);
      ctxCallbacks.setShapesHistory(shapesHistoryCopy);
    };
  }, [values.isFalling]);

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
          bucketToggle={callbacks.bucketToggle}
          isEraserActive={values.eraserActive}
          isBucketActive={values.bucketActive}
        />
        <canvas
          onPointerDown={handlers.onPointerDown}
          onPointerMove={handlers.onPointerMove}
          onPointerUp={handlers.onPointerUp}
          onPointerOut={handlers.onPointerOut}
          ref={canvasRef}
          className={cn('canvas')}
        />

        <div className={cn('bottom-utils')}>
          <div className={cn('zoom-btns')}>
            <button onClick={() => callbacks.zoomAction(-0.1)}>-</button>
            <button onClick={() => ctxCallbacks.setScale(1)}>{options.percentScaleFormat}</button>
            <button onClick={() => callbacks.zoomAction(0.1)}>+</button>
          </div>

          <div>
            <button onClick={() => ctxCallbacks.setIsFalling(!values.isFalling)}>
              {values.isFalling ? 'Остановить' : 'Уронить'}
            </button>
          </div>

          <div>
            <button onClick={() => ctxCallbacks.setScale(1)}>Сбросить зум</button>
            <button onClick={() => ctxCallbacks.setPanOffset({ x: 0, y: 0 })}>
              Сбросить скролл
            </button>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}

export default memo(ArtCanvasInner);

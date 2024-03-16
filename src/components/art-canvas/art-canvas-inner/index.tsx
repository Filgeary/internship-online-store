import './style.css';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

import { TArtImage, TTools } from '@src/store/art/types';
import ArtCanvasUtils from '../art-canvas-utils';
import ArtManager from '../manager';
import { TShapes } from '../shapes/types';
import cloneDeep from 'lodash.clonedeep';
import doShapeCopy from '../utils/do-shape-copy';

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
    zoomAction: (delta: number) => canvasManager.zoomAction(delta),

    clearCanvasPicture: () => {
      canvasManager.clearCanvasPicture();
      callbacks.endAction();
    },

    endAction: (selectedShapeId?: string) => {
      setIsPointerDown(false);
      canvasManager.endAction(selectedShapeId);
    },
  };

  const helpers = {
    getMouseCoordinates: (e: MouseEvent) => {
      const clientX =
        (e.clientX - values.panOffset.x * values.scale + values.scaleOffset.x) / values.scale;
      const clientY =
        (e.clientY - values.panOffset.y * values.scale + values.scaleOffset.y) / values.scale;
      return { clientX, clientY };
    },
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
        if (isSpacePressed) {
          const { clientX, clientY } = helpers.getMouseCoordinates(e.nativeEvent);

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
          x: offsetX,
          y: offsetY,
          xWithOffset,
          yWithOffset,
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
          // const shape = canvasManager.draw(values.activeTool, {
          //   brushWidth: values.brushWidth,
          //   brushColor: values.brushColor,
          //   x: offsetX + values.panOffset.x,
          //   y: offsetY + values.panOffset.y,
          //   isFilled: values.fillColor,
          // startCoords: {
          //   x: startCoords.x + values.panOffset.x,
          //   y: startCoords.y + values.panOffset.y,
          // },
          // }) as TShapes;
          const shape = canvasManager.draw(values.activeTool, {
            brushWidth: values.brushWidth,
            brushColor: values.brushColor,
            x: offsetX,
            y: offsetY,
            isFilled: values.fillColor,
            startCoords,
            initialCoords: {
              x: offsetX + values.panOffset.x,
              y: offsetY + values.panOffset.y,
              startCoords: {
                x: startCoords.x + values.panOffset.x,
                y: startCoords.y + values.panOffset.y,
              },
            },
          }) as TShapes;

          canvasManager.updateShapes(shape);
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

    const pointerMoveHandler = (e: PointerEvent) => {
      shapeSelected.options.x += e.movementX;
      shapeSelected.options.y += e.movementY;
      shapeSelected.options.startCoords.x += e.movementX;
      shapeSelected.options.startCoords.y += e.movementY;

      shapeSelected.options.initialCoords.x += e.movementX;
      shapeSelected.options.initialCoords.y += e.movementY;
      shapeSelected.options.initialCoords.startCoords.x += e.movementX;
      shapeSelected.options.initialCoords.startCoords.y += e.movementY;

      canvasManager.clearCanvasPicture();

      values.images.shapes.forEach((shape) => shape.draw());
      shapeSelected.draw();
    };

    const pointerUpHandler = () => {
      setStartCoords({ x: null, y: null });
      setIsPointerDown(false);
      ctxCallbacks.setShapes(values.images.shapes.slice());
      // callbacks.endAction(shapeSelected.id);
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
    canvasManager.init(canvasRef.current, canvasRef.current.getContext('2d'), ctxCallbacks, values);
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
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ControlLeft': {
          setIsCtrlPressed(false);
          break;
        }

        case 'Space': {
          setIsSpacePressed(false);
          break;
        }
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

    canvasManager.fillBgOpacityColor();

    canvasManager.getBinary().then((blob) => {
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      ctxCallbacks.setImagesNodes([...values.images.imagesNodes, image]);
    });
  }, []);

  // Установка динамических фигур (чтобы можно было перетаскивать в любой момент)
  useEffect(() => {
    const shapesHistoryStep = values.images.shapesHistory[values.activeImage - 1];
    if (!shapesHistoryStep?.length) return;

    ctxCallbacks.setShapes(cloneDeep(shapesHistoryStep));
    ctxCallbacks.setShapesHistory(values.images.shapesHistory.slice(0, values.activeImage));
  }, [values.activeImage]);

  // Действия по изменению зума и рисованию
  useEffect(() => {
    // Центрирование
    const { x, y } = canvasManager.getCoordsByScaleOffsets(values.scale);
    ctxCallbacks.setScaleOffset({ x, y });

    const imageNode = values.images.imagesNodes[values.activeImage];
    if (!imageNode) return;

    console.log('initDrawNow');
    // canvasManager.initDrawAll(imageNode, {
    //   scaleOffsetX: x,
    //   scaleOffsetY: y,
    // });
  }, [values.scale, values.images.imagesNodes, values.activeImage, values.panOffset]);

  useEffect(() => {
    canvasManager.clearCanvasPicture();
    canvasManager.save();
    canvasManager.translate(values.panOffset.x, values.panOffset.y);
    const shapesUpdatedCopy = values.images.shapes.map((shape) => {
      const shapeCopy = doShapeCopy(shape);
      console.log(shapeCopy.options.initialCoords);

      shapeCopy.options.x = shapeCopy.options.initialCoords.x + values.panOffset.x;
      shapeCopy.options.y = shapeCopy.options.initialCoords.y + values.panOffset.y;

      shapeCopy.options.startCoords.x =
        shapeCopy.options.initialCoords.startCoords.x + values.panOffset.x;
      shapeCopy.options.startCoords.y =
        shapeCopy.options.initialCoords.startCoords.y + values.panOffset.y;

      return shapeCopy;
    });

    ctxCallbacks.setShapes(shapesUpdatedCopy);

    shapesUpdatedCopy.forEach((shape) => shape.draw());
    canvasManager.restore();
  }, [values.panOffset]);

  // Panning-фича
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

        <div className={cn('bottom-utils')}>
          <div className={cn('zoom-btns')}>
            <button onClick={() => callbacks.zoomAction(-0.1)}>-</button>
            <button onClick={() => ctxCallbacks.setScale(1)}>
              {new Intl.NumberFormat('ru-RU', { style: 'percent' }).format(values.scale)}
            </button>
            <button onClick={() => callbacks.zoomAction(0.1)}>+</button>
          </div>

          <div>
            <button>Уронить</button>
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

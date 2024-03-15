import './style.css';

import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Panning
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });

  // Scaling
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

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

    zoomAction: (delta: number) =>
      setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.1), 2)),
  };

  const helpers = {
    getMouseCoordinates: (e: MouseEvent) => {
      const clientX = (e.clientX - panOffset.x * scale + scaleOffset.x) / scale;
      const clientY = (e.clientY - panOffset.y * scale + scaleOffset.y) / scale;
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
          setStartPanMousePosition({ x: offsetX, y: offsetY });
          return;
        }

        setSnapshot(canvasManager.current.getImageData());
      }
    },

    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isPointerDown) {
        const { offsetX, offsetY } = e.nativeEvent;

        // Panning action
        if (isSpacePressed) {
          // @ts-ignore
          const { clientX, clientY } = helpers.getMouseCoordinates(e);

          console.log({ clientX, clientY });

          const deltaX = clientX - startPanMousePosition.x;
          const deltaY = clientY - startPanMousePosition.y;

          setPanOffset((prevPanOffset) => ({
            x: prevPanOffset.x + deltaX,
            y: prevPanOffset.y + deltaY,
          }));

          return;
        }

        if (isCtrlPressed || !snapshot) return;

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

  // Установка динамических фигур (чтобы можно было перетаскивать в любой момент)
  useEffect(() => {
    const shapesHistoryStep = values.images.shapesHistory[values.activeImage - 1];
    if (!shapesHistoryStep?.length) return;

    ctxCallbacks.setShapes(cloneDeep(shapesHistoryStep));
    ctxCallbacks.setShapesHistory(values.images.shapesHistory.slice(0, values.activeImage));
  }, [values.activeImage, values.images.shapesHistory]);

  // Действия по изменению зума и рисованию
  useEffect(() => {
    // Центрирование
    const { x, y } = canvasManager.current.getCoordsByScaleOffsets(scale);
    setScaleOffset({ x, y });

    const imageNode = values.images.imagesNodes[values.activeImage];

    canvasManager.current.initDrawAll(imageNode, {
      panOffset,
      scale,
      scaleOffsetX: x,
      scaleOffsetY: y,
    });
  }, [scale, values.images.imagesNodes, values.activeImage, panOffset]);

  // Panning-фича
  useEffect(() => {
    const panFunction = (e: WheelEvent) => {
      const { x, y } = e;
      const element = document.elementFromPoint(x, y);
      if (element !== canvasRef.current) return;

      e.preventDefault();

      // Горизонтальный скролл
      if (e.ctrlKey || e.metaKey) {
        setPanOffset((prevPanOffset) => ({
          ...prevPanOffset,
          x: prevPanOffset.x - e.deltaY,
        }));
      } else {
        setPanOffset((prevPanOffset) => ({
          x: prevPanOffset.x - e.deltaX,
          y: prevPanOffset.y - e.deltaY,
        }));
      }
    };

    document.addEventListener('wheel', panFunction, { passive: false });

    return () => {
      document.removeEventListener('wheel', panFunction);
    };
  }, []);

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
        <button onClick={() => callbacks.zoomAction(-0.1)}>-</button>
        <button onClick={() => setScale(1)}>
          {new Intl.NumberFormat('ru-RU', { style: 'percent' }).format(scale)}
        </button>
        <button onClick={() => callbacks.zoomAction(0.1)}>+</button>
      </div>
      <hr />
    </>
  );
}

export default memo(ArtCanvasInner);

import './style.css';

import { cn as bem } from '@bem-react/classname';
import React, { memo, useEffect, useRef } from 'react';
import { useArtCanvasContext } from '..';

import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaTrash } from 'react-icons/fa';
import { TArtImage } from '../types';

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);

  const {
    brushWidth,
    brushColor,
    bgColor,
    setBgColor,
    setBrushColor,
    setBrushWidth,
    images,
    setImages,
    activeImage,
    setActiveImage,
    canSave,
  } = useArtCanvasContext();

  const callbacks = {
    clearCanvasPicture: () => {
      canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    },

    clearCanvas: () => {
      canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setBgColor('#ffffff');
      setBrushColor('#000000');
      setBrushWidth(5);
    },

    downloadCanvas: () => {
      canvasRef.current.toBlob((blob) => {
        const image = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = image;
        link.download = 'canvas_image.jpg';
        link.click();
      });
    },

    undo: () => {
      // @ts-ignore
      setActiveImage(Math.max(activeImage - 1, 0));
    },

    redo: () => {
      // @ts-ignore
      setActiveImage(Math.min(activeImage + 1, images.length - 1));
    },

    clearImages: () => {
      setActiveImage(0);
      setImages(images.slice(0, 1));
    },
  };

  const options = {
    undoDisabled: activeImage === 0,
    redoDisabled: activeImage === images.length - 1,
    clearImagesDisabled: images.length === 1,
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasNode = canvasRef.current;

    canvasCtx.current = canvasNode.getContext('2d');

    const ctx = canvasCtx.current;
    let isDown = false;

    const leftMouseBtn = 0;

    // Действия при отпускании ЛКМ / выхода за канвас
    const endAction = () => {
      canvasRef.current.toBlob((blob) => {
        const image = new Image(canvasRef.current.width, canvasRef.current.height) as TArtImage;
        image.src = URL.createObjectURL(blob);

        const nextActiveImage = activeImage + 1;
        const correctOldImages = activeImage !== images.length - 1 ? images.slice(0, -1) : images;
        const nextImages = [...correctOldImages, image];

        console.log({ activeImage, images });

        setImages(nextImages);
        setActiveImage(nextActiveImage);
      });
      ctx.closePath();
      isDown = false;
    };

    const downHandler = (e: PointerEvent) => {
      if (e.button === leftMouseBtn) {
        ctx.beginPath();
        isDown = true;
      }
    };

    const moveHandler = (e: PointerEvent) => {
      if (isDown) {
        const { offsetX, offsetY } = e;
        ctx.lineWidth = brushWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    };

    const upHandler = (e: PointerEvent) => {
      if (e.button === leftMouseBtn) {
        endAction();
      }
    };

    const outHandler = () => {
      if (isDown) {
        endAction();
      }
    };

    canvasNode.addEventListener('pointerdown', downHandler);
    canvasNode.addEventListener('pointermove', moveHandler);
    canvasNode.addEventListener('pointerup', upHandler);
    canvasNode.addEventListener('pointerout', outHandler);

    return () => {
      canvasNode.removeEventListener('pointerdown', downHandler);
      canvasNode.removeEventListener('pointermove', moveHandler);
      canvasNode.removeEventListener('pointerup', upHandler);
      canvasNode.removeEventListener('pointerout', outHandler);
    };
  }, [brushWidth, brushColor, images, activeImage]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === 'z') {
          callbacks.undo();
        } else if (e.key === 'y') {
          callbacks.redo();
        }
        console.log(e.key);
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [images]);

  useEffect(() => {
    const ctx = canvasCtx.current;

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasRef.current.toBlob((blob) => {
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      setImages((prevImages) => [...prevImages, image]);
    });
  }, []);

  useEffect(() => {
    canvasRef.current.style.setProperty('background-color', bgColor);
  }, [bgColor]);

  useEffect(() => {
    const imageNode = images[activeImage];
    console.log(images, activeImage, imageNode);
    if (!imageNode) {
      return;
    }

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
  }, [images, activeImage]);

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
          </div>

          <div className={cn('utils-right')}>
            <button className={cn('utils-btn')} onClick={callbacks.clearCanvas}>
              Сбросить всё
            </button>
            <button className={cn('utils-btn')} onClick={callbacks.clearCanvasPicture}>
              Очистить рисунок
            </button>
            <button
              disabled={!canSave}
              className={cn('utils-btn')}
              onClick={callbacks.downloadCanvas}
            >
              Скачать
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} width={984} height={492} className={cn('canvas')}></canvas>
    </div>
  );
}

export default memo(ArtCanvasInner);

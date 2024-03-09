import './style.css';

import React, { memo, useEffect, useRef } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useArtCanvasContext } from '..';

import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaTrash } from 'react-icons/fa';
import { TArtImage } from '../types';

function ArtCanvasInner() {
  const cn = bem('ArtCanvasInner');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);
  const isDown = useRef<boolean>(false);

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
      // Для заднего фона на загружаемой картинке
      canvasCtx.current.globalCompositeOperation = 'destination-over';
      canvasCtx.current.fillStyle = bgColor;
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

        console.log({ activeImage, images });
        const nextActiveImage = activeImage + 1;
        const nextImages = [...images.slice(0, activeImage + 1), image];

        setImages(nextImages);
        setActiveImage(nextActiveImage);
      });

      canvasCtx.current.closePath();
      isDown.current = false;
    },

    undo: () => {
      console.log({ activeImage, images });
      setActiveImage(Math.max(activeImage - 1, 0));
    },

    redo: () => {
      setActiveImage(Math.min(activeImage + 1, images.length - 1));
    },

    clearImages: () => {
      const newImages = [...images];
      newImages.length = 1;

      setActiveImage(0);
      setImages(newImages);
    },
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button === options.leftMouseBtn) {
        canvasCtx.current.beginPath();
        isDown.current = true;
      }
    },

    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isDown.current) {
        const { offsetX, offsetY } = e.nativeEvent;
        canvasCtx.current.lineWidth = brushWidth;
        canvasCtx.current.lineCap = 'round';
        canvasCtx.current.strokeStyle = brushColor;
        canvasCtx.current.lineTo(offsetX, offsetY);
        canvasCtx.current.stroke();
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
  };

  const options = {
    leftMouseBtn: 0,
    undoDisabled: activeImage === 0,
    redoDisabled: activeImage === images.length - 1,
    clearImagesDisabled: images.length === 1,
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.code === 'KeyZ') {
          callbacks.undo();
        } else if (e.key === 'keyY') {
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
    canvasCtx.current = canvasRef.current.getContext('2d');

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
      <canvas
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerUp={handlers.onPointerUp}
        onPointerOut={handlers.onPointerOut}
        ref={canvasRef}
        width={984}
        height={492}
        className={cn('canvas')}
      ></canvas>
    </div>
  );
}

export default memo(ArtCanvasInner);

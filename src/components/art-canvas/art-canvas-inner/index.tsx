import './style.css';

import { cn as bem } from '@bem-react/classname';
import React, { memo, useEffect, useRef } from 'react';
import { useArtCanvasContext } from '..';

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
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasNode = canvasRef.current;

    canvasCtx.current = canvasNode.getContext('2d');

    const ctx = canvasCtx.current;
    let isDown = false;

    const downHandler = () => {
      ctx.beginPath();
      isDown = true;
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

    const upHandler = () => {
      canvasRef.current.toBlob((blob) => {
        const image = new Image(canvasRef.current.width, canvasRef.current.height);
        image.src = URL.createObjectURL(blob);
        // @ts-ignore
        setImages((prevImages) => [...prevImages, image]);
      });
      ctx.closePath();
      isDown = false;
    };

    const outHandler = () => {
      if (isDown) {
        canvasRef.current.toBlob((blob) => {
          const image = new Image(canvasRef.current.width, canvasRef.current.height);
          image.src = URL.createObjectURL(blob);
          // @ts-ignore
          setImages((prevImages) => [...prevImages, image]);
        });
        ctx.closePath();
        isDown = false;
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
  }, [brushWidth, brushColor]);

  useEffect(() => {
    const keyDownHandler = (e: React.KeyboardEvent<HTMLDocument>) => {
      console.log(e.key);
      if (e.ctrlKey) {
        if (e.key === 'z') {
          console.log('Назад');
          canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.current.drawImage(images.at(-2), 0, 0);
        } else if (e.key === 'y') {
          console.log('Вперёд');
        }
        console.log(e.key);
      }
    };

    //@ts-ignore
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      //@ts-ignore
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [images]);

  useEffect(() => {
    const ctx = canvasCtx.current;

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  useEffect(() => {
    canvasRef.current.style.setProperty('background-color', bgColor);
  }, [bgColor]);

  return (
    <div className={cn()}>
      <div className={cn('utils')}>
        <div className={cn('utils-row')}>
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
      <canvas ref={canvasRef} width={984} height={492} className={cn('canvas')}></canvas>
    </div>
  );
}

export default memo(ArtCanvasInner);

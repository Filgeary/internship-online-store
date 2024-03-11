import './style.css';

import { memo, useEffect, useRef } from 'react';
import dvdImage from '../assets/dvd.png';
import { cn as bem } from '@bem-react/classname';
import getRandomNum from '@src/utils/get-random-num';

function ArtCanvasAdditional() {
  const cn = bem('ArtCanvasAdditional');
  const canvasCtx = useRef<CanvasRenderingContext2D>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dx = useRef(2);
  const dy = useRef(2);
  const speeds = useRef([2, 3]);
  const sizes = useRef({
    width: 120,
    height: 120,
  });
  const coords = useRef({
    x: 0,
    y: 0,
  });
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    canvasCtx.current = canvasRef.current.getContext('2d');

    image.current = new Image(sizes.current.width, sizes.current.height);
    image.current.src = dvdImage;
    coords.current = {
      x: getRandomNum(sizes.current.width, canvasRef.current.width - sizes.current.width),
      y: getRandomNum(sizes.current.height, canvasRef.current.height - sizes.current.height),
    };
  }, []);

  useEffect(() => {
    const ctx = canvasCtx.current;

    function loop() {
      if (!canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        image.current,
        coords.current.x,
        coords.current.y,
        sizes.current.width,
        sizes.current.height
      );

      coords.current.x += dx.current;
      coords.current.y += dy.current;

      const newSpeedY = speeds.current[getRandomNum(0, speeds.current.length - 1)];
      const newSpeedX = speeds.current[getRandomNum(0, speeds.current.length - 1)];

      if (coords.current.y + sizes.current.height >= canvasRef.current.height) {
        dy.current = -newSpeedY;
        dx.current = dx.current > 0 ? newSpeedX : -newSpeedX;
      } else if (coords.current.y <= 0) {
        dy.current = newSpeedY;
        dx.current = dx.current > 0 ? newSpeedX : -newSpeedX;
      }

      if (coords.current.x + sizes.current.width >= canvasRef.current.width) {
        dx.current = -newSpeedX;
        dy.current = dy.current > 0 ? newSpeedY : -newSpeedY;
      } else if (coords.current.x <= 0) {
        dx.current = newSpeedX;
        dy.current = dy.current > 0 ? newSpeedY : -newSpeedY;
      }

      window.requestAnimationFrame(loop);
    }

    loop();
  }, []);

  useEffect(() => {
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
  }, []);

  return (
    <div className={cn()}>
      DVD:
      <canvas className={cn('canvas')} ref={canvasRef} />
    </div>
  );
}

export default memo(ArtCanvasAdditional);

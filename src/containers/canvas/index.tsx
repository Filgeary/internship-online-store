import { useEffect, useRef } from 'react';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const prevCoords = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = e;
    prevCoords.current = { x: offsetX, y: offsetY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(prevCoords.current.x, prevCoords.current.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    prevCoords.current = { x: offsetX, y: offsetY };
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

  const handleClear = (width: number, height: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
  };

  type TRect = {
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
  };

  function drawRect(ctx: CanvasRenderingContext2D, options: TRect) {
    drawRect.state = {
      ...drawRect.state,
      ...options,
    };
    const { x, y, color, width, height } = { ...drawRect.state };
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  drawRect.state = {} as TRect;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // initial params
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 12;
    ctx.fillStyle = '#232222';
    ctx.fillRect(0, 0, width, height);

    drawRect(ctx, { x: 355, y: height * 0.59, color: 'red', width: 150, height: 102 });

    // draw a circle
    ctx.fillStyle = 'lime';
    ctx.beginPath();
    ctx.arc(Math.floor(width / 2), Math.floor(height * 0.75), 50, 0, 2 * Math.PI);
    ctx.fill();

    // Draw a triangle
    ctx.beginPath();
    ctx.fillStyle = 'dodgerblue';
    ctx.moveTo(550, 440);
    ctx.lineTo(650, 340);
    ctx.lineTo(700, 490); // Line to third point
    ctx.closePath();
    ctx.fill();

    // draw text
    ctx.font = '80px Ubuntu';
    ctx.fillStyle = 'cyan';
    ctx.fillText('Hello, Canvas!', 380, 120);

    // draw a line
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.moveTo(355, Math.floor(height * 0.69));
    ctx.lineTo(905, Math.floor(height * 0.7));
    ctx.stroke();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseLeave);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once

  return <canvas ref={canvasRef} />;
};

export default Canvas;

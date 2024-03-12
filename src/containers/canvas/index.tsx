import { useEffect, useRef } from 'react';

import { composition1 } from '../../utils/composition1';

import type { TCanvasActions } from '@src/components/canvas-panel';

type Props = {
  action: TCanvasActions | '';
};

const Canvas = ({ action }: Props) => {
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
    ctx.fillStyle = '#232222';
    ctx.fillRect(0, 0, width, height);
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

  type TCircle = {
    x: number;
    y: number;
    color: string;
    radius: number;
  };

  function drawCircle(ctx: CanvasRenderingContext2D, options: TCircle) {
    drawCircle.state = {
      ...drawCircle.state,
      ...options,
    };
    const { x, y, color, radius } = { ...drawCircle.state };
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  drawCircle.state = {} as TCircle;

  type TTriangle = {
    color: string;
    point1: { x: number; y: number };
    point2: { x: number; y: number };
    point3: { x: number; y: number };
  };

  function drawTriangle(ctx: CanvasRenderingContext2D, options: TTriangle) {
    drawTriangle.state = {
      ...drawTriangle.state,
      ...options,
    };
    const { color, point1, point2, point3 } = { ...drawTriangle.state };
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.closePath();
    ctx.fill();
  }
  drawTriangle.state = {} as TTriangle;

  type TText = {
    x: number;
    y: number;
    color: string;
    text: string;
    fontSize: number;
  };

  function drawText(ctx: CanvasRenderingContext2D, options: TText) {
    drawText.state = {
      ...drawText.state,
      ...options,
    };
    const { x, y, color, text, fontSize } = { ...drawText.state };
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px system-ui`;
    ctx.fillText(text, x, y);
  }
  drawText.state = {} as TText;

  type TLine = {
    color: string;
    lineWidth: number;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
  };

  function drawLine(ctx: CanvasRenderingContext2D, options: TLine) {
    drawLine.state = {
      ...drawLine.state,
      ...options,
    };
    const { color, lineWidth, startPoint, endPoint } = { ...drawLine.state };
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  }
  drawLine.state = {} as TLine;

  // TODO: refactor
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function drawInitialComposition(
    ctx: CanvasRenderingContext2D,
    {
      width,
      height,
    }: {
      width: number;
      height: number;
    },
  ) {
    drawText(ctx, composition1.createText());
    drawCircle(ctx, composition1.createCircle({ width, height }));
    drawRect(ctx, composition1.createRect({ height }));
    drawTriangle(ctx, composition1.createTriangle());
    drawLine(ctx, composition1.createLine({ height }));
  }

  // initialize
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

  // execute handlers on switch action
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    switch (action) {
      case 'clear':
        handleClear(canvas.width, canvas.height);
        break;
      case 'type':
        drawText(ctx, composition1.createText());
        break;
      case 'circle':
        drawCircle(ctx, composition1.createCircle({ width: canvas.width, height: canvas.height }));
        break;
      case 'rect':
        drawRect(ctx, composition1.createRect({ height: canvas.height }));
        break;
      case 'triangle':
        drawTriangle(ctx, composition1.createTriangle());
        break;
      case 'line':
        drawLine(ctx, composition1.createLine({ height: canvas.height }));
        break;
      case 'draw':
        break;
      case 'random':
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;

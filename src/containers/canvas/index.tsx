import { useEffect, useRef } from 'react';

import { DrawManager, initialCanvasState } from '@src/canvas/draw-manager';

import type { TCanvasActions, TCanvasModes } from '@src/components/canvas-panel/types';

type Props = {
  mode: TCanvasModes;
  action: TCanvasActions | '';
};

const Canvas = ({ mode, action }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawManagerRef = useRef<DrawManager>();
  const isDrawing = useRef(false);
  const prevCoords = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = e;
    prevCoords.current = { x: offsetX, y: offsetY };

    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;
    const mode = drawManager.getMode();

    // TODO: make drawing without given options
    // switch on mode
    switch (mode) {
      case 'type':
        drawManager.drawText({
          x: offsetX,
          y: offsetY,
          text: 'Hello World!',
          fontSize: 48,
          color: 'white',
        });
        break;
      case 'line':
        drawManager.drawLine({
          color: 'yellow',
          lineWidth: 16,
          startPoint: { x: offsetX, y: offsetY },
          endPoint: { x: offsetX + 300, y: offsetY + 300 },
        });
        break;
      case 'rect':
        drawManager.drawRect({
          x: offsetX,
          y: offsetY,
          width: 150,
          height: 150,
          color: 'red',
        });
        break;
      case 'circle':
        drawManager.drawCircle({
          x: offsetX,
          y: offsetY,
          radius: 75,
          color: 'lime',
        });
        break;
      case 'triangle':
        drawManager.drawTriangle({
          color: 'dodgerblue',
          startPoint: { x: offsetX, y: offsetY },
        });
        break;
      default:
        break;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;
    const mode = drawManager.getMode();

    if (isDrawing.current && mode === 'draw') {
      const { offsetX, offsetY } = e;
      const { x: prevX, y: prevY } = prevCoords.current;
      drawManager.drawByHand({ prevX, prevY, offsetX, offsetY });
      prevCoords.current = { x: offsetX, y: offsetY };
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

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

    drawManagerRef.current = new DrawManager(ctx, initialCanvasState);
    if (!(drawManagerRef.current instanceof DrawManager)) return;

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

  // set drawManager mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;

    drawManager.setMode(mode);
  }, [mode]);

  // handle actions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;

    switch (action) {
      case 'clear':
        drawManager.clear();
        break;
      case 'refresh':
        drawManager.init();
        break;
      default:
        break;
    }
  }, [action]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;

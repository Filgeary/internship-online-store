import { useEffect, useRef } from 'react';

import { config } from '@src/canvas/config';
import { DrawManager } from '@src/canvas/draw-manager';

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
    if (!canvasRef.current) return;
    isDrawing.current = true;
    const { offsetX, offsetY } = e;
    prevCoords.current = { x: offsetX, y: offsetY };

    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;
    const mode = drawManager.getMode();

    switch (mode) {
      case 'rect':
        drawManager.createRect({
          x: offsetX,
          y: offsetY,
        });
        break;
      case 'circle':
        drawManager.createCircle({
          x: offsetX,
          y: offsetY,
        });
        break;
      case 'triangle':
        drawManager.createTriangle({
          startPoint: { x: offsetX, y: offsetY },
        });
        break;
      case 'line':
        drawManager.createLine({
          startPoint: { x: offsetX, y: offsetY },
        });
        break;
      case 'text':
        drawManager.createText({
          x: offsetX,
          y: offsetY,
        });
        break;
      case 'select':
        drawManager.selectFigure({ x: offsetX, y: offsetY });
        break;
      case 'delete':
        drawManager.deleteFigure({ x: offsetX, y: offsetY });
        break;
      default:
        break;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;
    const mode = drawManager.getMode();

    const { offsetX, offsetY } = e;
    const { x: prevX, y: prevY } = prevCoords.current;

    if (isDrawing.current) {
      let selectedFigure;

      switch (mode) {
        case 'draw':
          drawManager.drawByHand({ prevX, prevY, offsetX, offsetY });
          prevCoords.current = { x: offsetX, y: offsetY };
          break;
        case 'select':
          selectedFigure = drawManager.getSelectedFigure();

          if (selectedFigure) {
            selectedFigure.instance.updatePosition({
              deltaX: offsetX - prevX,
              deltaY: offsetY - prevY,
            });
            prevCoords.current = { x: offsetX, y: offsetY };
          }
          break;
        case 'move':
          drawManager.moveCanvas({ deltaX: offsetX - prevX, deltaY: offsetY - prevY });
          prevCoords.current = { x: offsetX, y: offsetY };
          break;
      }
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    drawManagerRef.current?.unselectAll();
  };
  const handleMouseLeave = () => {
    isDrawing.current = false;
    drawManagerRef.current?.unselectAll();
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    drawManagerRef.current = new DrawManager(ctx, config);
    if (!(drawManagerRef.current instanceof DrawManager)) return;

    const drawManager = drawManagerRef.current;
    const draw = () => {
      drawManager.drawAll();
      requestAnimationFrame(draw);
    };
    draw();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseLeave);

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseLeave);

      window.removeEventListener('resize', handleResize);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once

  // set drawManager mode
  useEffect(() => {
    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;

    drawManager.setMode(mode);
  }, [mode]);

  // handle actions
  useEffect(() => {
    if (!drawManagerRef.current) return;
    const drawManager = drawManagerRef.current;

    switch (action) {
      case 'reset':
        drawManager.clear();
        break;
      default:
        break;
    }
  }, [action]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;

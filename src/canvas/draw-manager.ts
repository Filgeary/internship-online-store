import { Circle, DrawByHand, Line, Rect, Text, Triangle } from './figures';

import type { TCanvasModes } from '@src/components/canvas-panel/types';
import type { IFigure } from './types';

export const initialCanvasState = {
  mode: 'draw',
  strokeStyle: 'white',
  fillStyle: '#232222',
  lineWidth: 16,
  lineCap: 'round',
  lineJoin: 'round',
} as const;

type TInitialCanvasState = typeof initialCanvasState;

export class DrawManager {
  private ctx: CanvasRenderingContext2D;
  private mode: TCanvasModes;
  private figures: IFigure[] = [];

  // initial params
  private strokeStyle: string;
  private fillStyle: string;
  private lineWidth: number;
  private lineCap: CanvasLineCap;
  private lineJoin: CanvasLineJoin;

  constructor(ctx: CanvasRenderingContext2D, initialState: TInitialCanvasState) {
    this.ctx = ctx;
    this.mode = initialState.mode;
    this.figures = [];
    this.strokeStyle = initialState.strokeStyle;
    this.fillStyle = initialState.fillStyle;
    this.lineWidth = initialState.lineWidth;
    this.lineCap = initialState.lineCap;
    this.lineJoin = initialState.lineJoin;

    this.init();
    this.initFigure();
  }

  // initialize
  init = () => {
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = this.lineCap;
    this.ctx.lineJoin = this.lineJoin;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  };

  initFigure = () => {
    this.createText({
      x: this.ctx.canvas.width / 2,
      y: 100,
      text: 'Canvasify',
      fontSize: 64,
      fillColor: 'cyan',
    });
  };

  // set mode
  setMode = (mode: TCanvasModes) => {
    this.mode = mode;
  };
  // get mode
  getMode = () => {
    return this.mode;
  };

  // Setters for common properties
  setStrokeColor(color: string) {
    this.strokeStyle = color;
  }

  setFillStyle(color: string) {
    this.fillStyle = color;
  }

  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
  }

  // clear canvas
  clear = () => {
    this.figures = [];
    this.initFigure();
  };

  reset = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.init();
  };

  // draw all
  drawAll = () => {
    this.reset();
    this.figures.forEach(figure => {
      figure.draw();
    });
  };

  // Draw methods
  createText = (options: {
    x: number;
    y: number;
    text?: string;
    fontSize?: number;
    fillColor?: string;
  }) => {
    const text = new Text(this.ctx, options);
    this.figures.push(text);
  };

  createRect = (options: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    fillColor?: string;
  }) => {
    const rect = new Rect(this.ctx, options);
    this.figures.push(rect);
  };

  createCircle = (options: { x: number; y: number; radius?: number; fillColor?: string }) => {
    const circle = new Circle(this.ctx, options);
    this.figures.push(circle);
  };

  createTriangle = (options: { startPoint: { x: number; y: number }; fillColor?: string }) => {
    const triangle = new Triangle(this.ctx, options);
    this.figures.push(triangle);
  };

  createLine = (options: {
    startPoint: { x: number; y: number };
    strokeColor?: string;
    lineWidth?: number;
  }) => {
    const line = new Line(this.ctx, options);
    this.figures.push(line);
  };

  drawByHand = (options: { prevX: number; prevY: number; offsetX: number; offsetY: number }) => {
    const drawByHand = new DrawByHand(this.ctx, options);
    this.figures.push(drawByHand);
  };
}

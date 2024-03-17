import { Circle, DrawByHand, Line, Rect, Text, Triangle } from './figures';

import type { TCanvasModes } from '@src/components/canvas-panel/types';
import type { IFigure } from './types';

const uuid = () => self.crypto.randomUUID();

type TFigureEntity = {
  id: string;
  instance: IFigure;
  path?: Path2D;
};

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
  private figures: TFigureEntity[];
  private selectedFigure: TFigureEntity | null;

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
    this.selectedFigure = null;
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
      y: 80,
      text: 'Canvasify',
      fontSize: 50,
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

  getFigureByPathIntersection = ({ x, y }: { x: number; y: number }) => {
    return this.figures.find(figure => {
      if (figure.path) {
        return this.ctx.isPointInPath(figure.path, x, y);
      }
    });
  };

  selectFigure = ({ x, y }: { x: number; y: number }) => {
    const { id } = this.getFigureByPathIntersection({ x, y }) || {};
    if (id) {
      const foundedFigure = this.figures.findLast(figure => figure.id === id);
      if (foundedFigure) {
        foundedFigure.instance.select();
        this.selectedFigure = foundedFigure;
      }
    } else {
      this.selectedFigure = null;
      this.figures.forEach(figure => figure.instance.unselect());
    }
  };

  unselectAll = () => {
    this.updateSelectedFigurePathByID(this.selectedFigure?.id || '');
    this.selectedFigure = null;
    this.figures.forEach(figure => figure.instance.unselect());
  };

  getSelectedFigure = () => {
    return this.selectedFigure;
  };

  updateSelectedFigurePathByID = (id: string) => {
    const selectedFigure = this.figures.find(figure => figure.id === id);
    if (selectedFigure) {
      selectedFigure.path = selectedFigure.instance.getFigurePath();
    }
  };

  deleteFigure = ({ x, y }: { x: number; y: number }) => {
    const { id } = this.getFigureByPathIntersection({ x, y }) || {};
    if (id) {
      this.figures = this.figures.filter(figure => figure.id !== id);
    }
  };

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
    this.figures.forEach(figure => figure.instance.draw());
  };

  // Setters for common properties
  setStrokeStyle(color: string) {
    this.strokeStyle = color;
  }

  setFillStyle(color: string) {
    this.fillStyle = color;
  }

  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
  }

  // Draw methods
  createText = (options: {
    x: number;
    y: number;
    text?: string;
    fontSize?: number;
    fillColor?: string;
  }) => {
    const text = new Text(this.ctx, options);
    this.figures.push({
      id: uuid(),
      instance: text,
    });
  };

  createRect = (options: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    strokeStyle?: string;
  }) => {
    const rect = new Rect(this.ctx, options);
    this.figures.push({
      id: uuid(),
      instance: rect,
      path: rect.getFigurePath(),
    });
  };

  createCircle = (options: { x: number; y: number; radius?: number; strokeStyle?: string }) => {
    const circle = new Circle(this.ctx, options);
    this.figures.push({
      id: uuid(),
      instance: circle,
      path: circle.getFigurePath(),
    });
  };

  createTriangle = (options: { startPoint: { x: number; y: number }; strokeStyle?: string }) => {
    const triangle = new Triangle(this.ctx, options);
    this.figures.push({
      id: uuid(),
      instance: triangle,
      path: triangle.getFigurePath(),
    });
  };

  createLine = (options: {
    startPoint: { x: number; y: number };
    strokeStyle?: string;
    lineWidth?: number;
  }) => {
    const line = new Line(this.ctx, options);
    this.figures.push({
      id: uuid(),
      instance: line,
      path: line.getFigurePath(),
    });
  };

  drawByHand = (options: { prevX: number; prevY: number; offsetX: number; offsetY: number }) => {
    const drawByHand = new DrawByHand(this.ctx, options);
    this.figures.push({
      id: uuid(),
      instance: drawByHand,
    });
  };
}

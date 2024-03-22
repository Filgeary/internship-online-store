import { config as initialCanvasState } from './config';
import { MAX_ZOOM, MIN_ZOOM } from './constants';
import { Circle, DrawByHand, Line, Rect, Text, Triangle } from './figures';

import type { TCanvasModes } from '@src/components/canvas-panel/types';
import type { IFigure } from './types';

const uuid = () => self.crypto.randomUUID();

type TFigureEntity = {
  id: string;
  instance: IFigure;
  path?: Path2D;
};

type TInitialCanvasState = typeof initialCanvasState;

export class DrawManager {
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private scaleOffset: { x: number; y: number };
  private isPlayingAnimation: boolean;
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
    this.scale = 1;
    this.scaleOffset = { x: 0, y: 0 };
    this.isPlayingAnimation = false;
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
  private init = () => {
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = this.lineCap;
    this.ctx.lineJoin = this.lineJoin;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  };

  private initFigure = () => {
    this.createText({
      x: this.ctx.canvas.width / 2,
      y: 80,
      text: 'Canvasify',
      fontSize: 50,
      fillColor: 'cyan',
    });
  };

  private getFigureByPathIntersection = ({ x, y }: { x: number; y: number }) => {
    return this.figures.find(figure => {
      if (figure.path) {
        return this.ctx.isPointInPath(figure.path, x, y);
      }
    });
  };

  private updateSelectedFigurePathByID = (id: string) => {
    const selectedFigure = this.figures.find(figure => figure.id === id);
    if (selectedFigure) {
      selectedFigure.path = selectedFigure.instance.getFigurePath();
    }
  };

  private reset = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.init();
  };

  private playAnimationFallDown = () => {
    this.figures.forEach(figure => {
      figure.instance.animateFallDown();
    });
  };

  // get & set mode
  // ============================================

  setMode = (mode: TCanvasModes) => {
    this.mode = mode;
  };

  getMode = () => {
    return this.mode;
  };

  // select & unselect, delete figures
  // ============================================

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

  deleteFigure = ({ x, y }: { x: number; y: number }) => {
    const { id } = this.getFigureByPathIntersection({ x, y }) || {};
    if (id) {
      this.figures = this.figures.filter(figure => figure.id !== id);
    }
  };

  // others
  // ============================================

  setPlay = () => {
    this.isPlayingAnimation = !this.isPlayingAnimation;
  };

  moveCanvas = ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => {
    this.figures.forEach(figure => {
      figure.instance.updatePosition({ deltaX, deltaY });
      if (figure.path) {
        figure.path = figure.instance.getFigurePath();
      }
    });
  };

  zoomIn({ x, y, zoomDelta }: { x: number; y: number; zoomDelta: number }) {
    this.setAdjustedScaleOffsetByMousePoint({ x, y, zoomDelta, isZoomIn: true });
  }

  zoomOut({ x, y, zoomDelta }: { x: number; y: number; zoomDelta: number }) {
    this.setAdjustedScaleOffsetByMousePoint({ x, y, zoomDelta, isZoomIn: false });
  }

  // clear & draw canvas
  // ============================================

  clear = () => {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.figures = [];
    this.initFigure();
  };

  drawAll = () => {
    this.reset();
    const { x: scaleOffsetX, y: scaleOffsetY } = this.scaleOffset;

    this.ctx.translate(-scaleOffsetX, -scaleOffsetY);
    this.ctx.scale(this.scale, this.scale);
    this.figures.forEach(figure => figure.instance.draw());

    if (this.isPlayingAnimation) {
      this.playAnimationFallDown();
    }

    // reverse scale/translate
    this.ctx.scale(1 / this.scale, 1 / this.scale);
    this.ctx.translate(scaleOffsetX, scaleOffsetY);
  };

  // getters
  // ============================================

  getFigures = () => {
    return this.figures;
  };

  // Setters for common properties
  // ============================================

  setScale(scale: number) {
    this.scale = scale;
    this.setAdjustedScaleOffsetByCanvasCenter();
  }

  setScaleOffset({ x, y }: { x: number; y: number }) {
    this.scaleOffset = { x, y };
  }

  setAdjustedScaleOffsetByCanvasCenter() {
    const scaledWidth = this.ctx.canvas.width * this.scale;
    const scaledHeight = this.ctx.canvas.height * this.scale;
    const scaleOffsetX = (scaledWidth - this.ctx.canvas.width) / 2;
    const scaleOffsetY = (scaledHeight - this.ctx.canvas.height) / 2;
    this.setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
  }

  setAdjustedScaleOffsetByMousePoint({
    x,
    y,
    zoomDelta,
    isZoomIn,
  }: {
    x: number;
    y: number;
    zoomDelta: number;
    isZoomIn: boolean;
  }) {
    const scalingValue = isZoomIn ? this.scale + zoomDelta : this.scale - zoomDelta;
    const scaledX = x * scalingValue;
    const scaledY = y * scalingValue;
    if (isZoomIn) {
      this.scale = +Math.min(MAX_ZOOM, this.scale + zoomDelta).toFixed(2);
    } else {
      this.scale = +Math.max(MIN_ZOOM, this.scale - zoomDelta).toFixed(2);
    }
    const scaleOffsetX = Math.floor((scaledX - x) / this.scale) * this.scale;
    const scaleOffsetY = Math.floor((scaledY - y) / this.scale) * this.scale;
    this.setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
  }

  setZoomCenterToCanvasCenter() {
    this.scaleOffset = {
      x: 0,
      y: 0,
    };
  }

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
  // ============================================

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

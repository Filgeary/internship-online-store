import { TCanvasModes } from '@src/components/canvas-panel/types';

export const initialCanvasState = {
  mode: 'draw',
  color: 'white',
  fillStyle: '#232222',
  lineWidth: 16,
  lineCap: 'round',
  lineJoin: 'round',
} as const;

type TInitialCanvasState = typeof initialCanvasState;

export class DrawManager {
  private ctx: CanvasRenderingContext2D;

  // initial params
  private mode: TCanvasModes;
  private color: string;
  private fillStyle: string;
  private lineWidth: number;
  private lineCap: CanvasLineCap;
  private lineJoin: CanvasLineJoin;

  constructor(ctx: CanvasRenderingContext2D, initialState: TInitialCanvasState) {
    this.ctx = ctx;
    this.mode = initialState.mode;
    this.color = initialState.color;
    this.fillStyle = initialState.fillStyle;
    this.lineWidth = initialState.lineWidth;
    this.lineCap = initialState.lineCap;
    this.lineJoin = initialState.lineJoin;

    this.init();
  }

  // initialize
  init = () => {
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = this.lineCap;
    this.ctx.lineJoin = this.lineJoin;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.drawText({
      x: this.ctx.canvas.width / 2,
      y: 100,
      text: 'Canvasify',
      fontSize: 64,
      color: 'cyan',
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
  setColor(color: string) {
    this.color = color;
  }

  setFillStyle(fillStyle: string) {
    this.fillStyle = fillStyle;
  }

  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
  }

  // clear canvas
  clear = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.init();
  };

  // Draw methods
  drawRect = (options: { x: number; y: number; width: number; height: number; color: string }) => {
    this.ctx.fillStyle = options.color || this.color;
    this.ctx.fillRect(options.x, options.y, options.width, options.height);
  };

  drawCircle = (options: { x: number; y: number; radius: number; color: string }) => {
    this.ctx.fillStyle = options.color || this.color;
    this.ctx.beginPath();
    this.ctx.arc(options.x, options.y, options.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  drawTriangle = (options: { color: string; startPoint: { x: number; y: number } }) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = options.color || this.color;
    this.ctx.moveTo(options.startPoint.x, options.startPoint.y);
    this.ctx.lineTo(options.startPoint.x + 150, options.startPoint.y + 150);
    this.ctx.lineTo(options.startPoint.x - 150, options.startPoint.y + 150);
    this.ctx.closePath();
    this.ctx.fill();
  };

  drawText = (options: { x: number; y: number; text: string; fontSize: number; color: string }) => {
    this.ctx.fillStyle = options.color || this.color;
    this.ctx.font = `${options.fontSize}px system-ui`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(options.text, options.x, options.y);
  };

  drawLine = (options: {
    color: string;
    lineWidth: number;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
  }) => {
    this.ctx.strokeStyle = options.color || this.color;
    this.ctx.lineWidth = options.lineWidth || this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(options.startPoint.x, options.startPoint.y);
    this.ctx.lineTo(options.endPoint.x, options.endPoint.y);
    this.ctx.closePath();
    this.ctx.stroke();
  };

  drawByHand = (options: { prevX: number; prevY: number; offsetX: number; offsetY: number }) => {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.moveTo(options.prevX, options.prevY);
    this.ctx.lineTo(options.offsetX, options.offsetY);
    this.ctx.stroke();
  };
}

import { IFigure } from './types';

abstract class Figure implements IFigure {
  protected ctx: CanvasRenderingContext2D;
  protected figurePath: Path2D;
  protected x: number;
  protected y: number;
  protected strokeStyle: string;
  protected defaultStrokeStyle: string;
  protected fillStyle: string;
  protected lineWidth: number;
  protected lineWidthByHandDrawing: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.figurePath = null!;
    this.x = 0;
    this.y = 0;
    this.strokeStyle = '#eee';
    this.defaultStrokeStyle = this.strokeStyle;
    this.fillStyle = 'transparent';
    this.lineWidth = 8;
    this.lineWidthByHandDrawing = 8;
  }

  abstract draw(): void;

  init() {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.strokeStyle = this.strokeStyle;
  }

  initByHandDrawing() {
    this.init();
    this.ctx.lineWidth = this.lineWidthByHandDrawing;
  }

  updatePosition({ deltaX, deltaY }: { deltaX: number; deltaY: number }) {
    this.x += deltaX;
    this.y += deltaY;
    this.figurePath.moveTo(deltaX, deltaY);
  }

  getFigurePath() {
    return this.figurePath;
  }

  setFigurePath(figurePath: Path2D) {
    this.figurePath = figurePath;
  }

  select() {
    this.strokeStyle = 'dodgerblue';
  }

  unselect() {
    this.strokeStyle = this.defaultStrokeStyle;
  }
}

export class Rect extends Figure {
  width: number;
  height: number;
  borderRadius: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    options: { x: number; y: number; width?: number; height?: number; strokeStyle?: string },
  ) {
    super(ctx);

    this.x = options.x;
    this.y = options.y;
    this.width = options.width || 300;
    this.height = options.height || 200;
    this.defaultStrokeStyle = this.strokeStyle = options.strokeStyle || '#eee';
    this.borderRadius = 16;

    this.draw();
  }

  draw() {
    super.init();

    const figurePath = new Path2D();
    figurePath.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
    this.ctx.stroke(figurePath);
    this.fillStyle = 'tomato';
    this.ctx.fill(figurePath);

    super.setFigurePath(figurePath);
  }
}

export class Circle extends Figure {
  radius: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    options: { x: number; y: number; radius?: number; strokeStyle?: string },
  ) {
    super(ctx);

    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius || 75;
    this.defaultStrokeStyle = this.strokeStyle = options.strokeStyle || '#eee';

    this.draw();
  }

  draw() {
    super.init();

    this.ctx.beginPath();
    const figurePath = new Path2D();
    figurePath.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke(figurePath);
    this.fillStyle = 'lime';
    this.ctx.fill(figurePath);

    super.setFigurePath(figurePath);
  }
}

export class Triangle extends Figure {
  constructor(
    ctx: CanvasRenderingContext2D,
    options: { startPoint: { x: number; y: number }; strokeStyle?: string },
  ) {
    super(ctx);

    this.x = options.startPoint.x;
    this.y = options.startPoint.y;
    this.defaultStrokeStyle = this.strokeStyle = options.strokeStyle || '#eee';

    this.draw();
  }

  draw() {
    super.init();

    this.ctx.beginPath();
    const figurePath = new Path2D();
    figurePath.moveTo(this.x, this.y);
    figurePath.lineTo(this.x + 150, this.y + 150);
    figurePath.lineTo(this.x - 150, this.y + 150);
    figurePath.closePath();
    this.ctx.stroke(figurePath);
    this.fillStyle = 'gold';
    this.ctx.fill(figurePath);

    super.setFigurePath(figurePath);
  }
}

export class Line extends Figure {
  constructor(
    ctx: CanvasRenderingContext2D,
    options: {
      startPoint: { x: number; y: number };
      strokeStyle?: string;
      lineWidth?: number;
    },
  ) {
    super(ctx);

    this.x = options.startPoint.x;
    this.y = options.startPoint.y;
    this.defaultStrokeStyle = this.strokeStyle = options.strokeStyle || '#eee';
    this.lineWidth = options.lineWidth || this.lineWidth;

    this.draw();
  }

  draw() {
    super.init();

    this.ctx.beginPath();
    const figurePath = new Path2D();
    figurePath.moveTo(this.x, this.y);
    figurePath.lineTo(this.x + 250, this.y + 250);
    figurePath.closePath();
    this.ctx.stroke(figurePath);

    super.setFigurePath(figurePath);
  }
}

export class Text extends Figure {
  text: string;
  fontSize: number;
  textAlign: CanvasTextAlign;

  constructor(
    ctx: CanvasRenderingContext2D,
    options: { x: number; y: number; text?: string; fontSize?: number; fillColor?: string },
  ) {
    super(ctx);

    this.text = options.text || 'Hello World!';
    this.fontSize = options.fontSize || 48;
    this.fillStyle = options.fillColor || '#eee';
    this.textAlign = 'center';
    this.x = options.x;
    this.y = options.y;

    this.draw();
  }

  draw() {
    super.init();

    this.ctx.font = `${this.fontSize}px system-ui`;
    this.ctx.textAlign = this.textAlign;
    this.ctx.fillText(this.text, this.x, this.y);
  }
}

export class DrawByHand extends Figure {
  prevX: number;
  prevY: number;
  offsetX: number;
  offsetY: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    options: { prevX: number; prevY: number; offsetX: number; offsetY: number },
  ) {
    super(ctx);

    this.prevX = options.prevX;
    this.prevY = options.prevY;
    this.offsetX = options.offsetX;
    this.offsetY = options.offsetY;

    this.draw();
  }

  draw() {
    super.initByHandDrawing();

    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.offsetX, this.offsetY);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}

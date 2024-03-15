import { IFigure } from './types';

abstract class Figure implements IFigure {
  protected ctx: CanvasRenderingContext2D;
  protected x: number;
  protected y: number;
  protected strokeStyle: string;
  protected fillStyle: string;
  protected lineWidth: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.strokeStyle = 'white';
    this.fillStyle = '#232222';
    this.lineWidth = 16;
  }

  abstract draw(): void;
}

export class Rect extends Figure {
  width: number;
  height: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    options: { x: number; y: number; width?: number; height?: number; fillColor?: string },
  ) {
    super(ctx);

    this.x = options.x;
    this.y = options.y;
    this.width = options.width || 150;
    this.height = options.height || 150;
    this.fillStyle = options.fillColor || 'red';
    this.strokeStyle = options.fillColor || 'red';

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Circle extends Figure {
  radius: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    options: { x: number; y: number; radius?: number; fillColor?: string },
  ) {
    super(ctx);

    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius || 75;
    this.fillStyle = options.fillColor || 'lime';
    this.strokeStyle = options.fillColor || 'lime';

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
  }
}

export class Triangle extends Figure {
  constructor(
    ctx: CanvasRenderingContext2D,
    options: { startPoint: { x: number; y: number }; fillColor?: string },
  ) {
    super(ctx);

    this.x = options.startPoint.x;
    this.y = options.startPoint.y;
    this.fillStyle = options.fillColor || 'dodgerblue';
    this.strokeStyle = options.fillColor || 'dodgerblue';

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + 150, this.y + 150);
    this.ctx.lineTo(this.x - 150, this.y + 150);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

export class Line extends Figure {
  constructor(
    ctx: CanvasRenderingContext2D,
    options: {
      startPoint: { x: number; y: number };
      strokeColor?: string;
      lineWidth?: number;
    },
  ) {
    super(ctx);

    this.x = options.startPoint.x;
    this.y = options.startPoint.y;
    this.strokeStyle = options.strokeColor || 'yellow';
    this.lineWidth = options.lineWidth || 16;

    this.draw();
  }

  draw() {
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + 250, this.y + 250);
    this.ctx.closePath();
    this.ctx.stroke();
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
    this.fillStyle = options.fillColor || 'white';
    this.textAlign = 'center';
    this.x = options.x;
    this.y = options.y;

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.fillStyle;
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
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.offsetX, this.offsetY);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}

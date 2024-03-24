import { Rect } from "../types";

abstract class Figure {
  x: number;
  y: number;
  color: string | undefined;
  width: number = 40;
  height: number = this.width;
  pause: boolean = false;
  time: number = performance.now();
  angle: number = 10;
  hover: boolean = false;

  constructor(
    x: number,
    y: number,
    color: string,
    width?: number,
    height?: number
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }
  }

  abstract animate(time: number): void;

  setPause(pause = true) {
    this.pause = pause;
    this.time = performance.now();
  }

  setHover(args: boolean) {
    this.hover = args;
  }

  setPosition({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract getBoundRect(): void;
  abstract isIntersectRect(rect: Rect): void;
  abstract insideFigure(x: number, y: number): boolean;

  get zIndex() {
    return 0;
  }
}

export default Figure;

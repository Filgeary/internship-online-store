import { DrawOptions } from "@src/components/draw/core/types";

abstract class Figure {
  name: string = "Figure";
  render: () => void = () => {};
  canvasContext: CanvasRenderingContext2D | undefined;
  drawOptions: DrawOptions | undefined;
  x1: number = -1;
  x2: number = -1;
  y1: number = -1;
  y2: number = -1;
  width: number = 0;
  height: number = 0;

  draw(
    canvasContext: CanvasRenderingContext2D,
    options: {
      fill: boolean;
      offsetX: number;
      offsetY: number;
      startMouseX: number;
      startMouseY: number;
    },
    drawOptions: DrawOptions
  ) {}

  changeDrawOptions(
    canvasContext: CanvasRenderingContext2D,
    options: DrawOptions,
    func: () => void
  ) {
    canvasContext.save();
    canvasContext.lineCap = "round";
    canvasContext.strokeStyle = options.strokeStyle;
    canvasContext.lineWidth = options.lineWidth;
    canvasContext.fillStyle = options.fillStyle ?? options.strokeStyle;
    func();
    canvasContext.restore();
  }

  calculateCoords(options: {
    offsetX: number;
    offsetY: number;
    startMouseX: number;
    startMouseY: number;
  }) {
    const width = options.offsetX - options.startMouseX;
      if (width >= 0) {
        this.x1 = options.startMouseX;
        this.x2 = options.offsetX;
        this.width = width;
      } else {
        this.x1 = options.offsetX;
        this.x2 = options.startMouseX;
        this.width = width * -1;
      }
      const height = options.offsetY - options.startMouseY;
      if (height >= 0) {
        this.y1 = options.startMouseY;
        this.y2 = options.offsetY;
        this.height = height;
      } else {
        this.y1 = options.offsetY;
        this.y2 = options.startMouseY;
        this.height = height * -1;
      }
  }

  isDragged(coord: { x: number; y: number }): boolean {
    if ((this.x1 <= coord.x && coord.x <= this.x2) && (this.y1 <= coord.y && coord.y <= this.y2)) {
      return true;
    }
    return false;
  }

  setPosition(coord: { x: number; y: number }) {
    this.x1 = coord.x;
    this.y1 = coord.y;
    this.x2 = coord.x + this.width;
    this.y2 = coord.y + this.height;
  }
}

export default Figure;

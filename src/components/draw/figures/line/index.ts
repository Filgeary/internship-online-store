import { DrawOptions } from "@src/components/draw/core/types";
import Figure from "..";

class Line extends Figure {
  name: string = "Line";
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
  ) {
    this.canvasContext = canvasContext;
    this.drawOptions = drawOptions;
    // this.calculateCoords(options);
    this.x1 = options.startMouseX;
    this.x2 = options.offsetX;
    this.width = options.offsetX - options.startMouseX;
    this.y1 = options.startMouseY;
    this.y2 = options.offsetY;
    this.height = options.offsetY - options.startMouseY;
    this.render = () => {
      this.changeDrawOptions(canvasContext, drawOptions, () => {
        canvasContext.beginPath();
        canvasContext.moveTo(this.x1, this.y1);
        canvasContext.lineTo(this.x2, this.y2);
        canvasContext.stroke();
      });
      
    };
  }

  setPosition(coord: { x: number; y: number }) {
    this.x1 = coord.x;
    this.y1 = coord.y;
    this.x2 = coord.x + this.width;
    this.y2 = coord.y + this.height;
  }
  isDragged(coord: { x: number; y: number }): boolean {
    let isX = false;
    let isY = false;
    if (this.x1 <= coord.x && coord.x <= this.x2) {
      if (this.width > 0) {
        isX = true;
      }
    } else {
      if (this.width < 0) {
        isX = true;
      }
    }
    if (this.y1 <= coord.y && coord.y <= this.y2) {
      if (this.height > 0) {
        isY = true;
      }
    } else {
      if (this.height < 0) {
        isY = true;
      }
    }
    if (isX && isY) {
      return true;
    }
    return false;
  }
}

export default Line;

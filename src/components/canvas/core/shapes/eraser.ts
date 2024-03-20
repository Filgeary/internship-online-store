import Pencil from "./pencil";
import Shape from "./shape";

class Eraser extends Pencil {
  constructor(
    stroke: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number
  ) {
    super(stroke, color, ctx, offsetX, offsetY, startX, startY);
    this.color = "#ffffff";
  }
}

export default Eraser;

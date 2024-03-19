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
    }
  ) {
    canvasContext.beginPath();
    canvasContext.moveTo(options.startMouseX, options.startMouseY);
    canvasContext.lineTo(options.offsetX, options.offsetY);
    canvasContext.stroke();
  }
}

export default Line;

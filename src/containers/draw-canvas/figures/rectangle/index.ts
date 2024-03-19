import Figure from "..";

class Rectangle extends Figure {
  name: string = "Rectangle";
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
    if (options.fill) {
      canvasContext.fillRect(
        options.offsetX,
        options.offsetY,
        options.startMouseX - options.offsetX,
        options.startMouseY - options.offsetY
      );
    } else {
      canvasContext.strokeRect(
        options.offsetX,
        options.offsetY,
        options.startMouseX - options.offsetX,
        options.startMouseY - options.offsetY
      );
    }
  }
}

export default Rectangle;

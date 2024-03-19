import Figure from "..";

class Triangle extends Figure {
  name: string = "Triangle";

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
    canvasContext.lineTo(
      options.startMouseX * 2 - options.offsetX,
      options.offsetY
    );
    canvasContext.closePath();
    if (options.fill) {
      canvasContext.fill();
    } else {
      canvasContext.stroke();
    }
  }
}

export default Triangle;

import Figure from "..";

class Eraser extends Figure {
  name: string = "Eraser";
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
    let color = canvasContext.strokeStyle;
    canvasContext.strokeStyle = "#FFFFFF";
    canvasContext.lineTo(options.offsetX, options.offsetY);
    canvasContext.stroke();
    canvasContext.strokeStyle = color;
  }
}

export default Eraser;

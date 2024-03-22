import Figure from "..";

class Pencil extends Figure {
  name: string = "Pencil";
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
    canvasContext.lineTo(options.offsetX, options.offsetY);
    canvasContext.stroke();
  }
}

export default Pencil;

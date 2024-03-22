import { DrawOptions } from "@src/components/draw/core/types";
import Figure from "..";

class Circle extends Figure {
  name: string = "Circle";
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
    this.render = () => {
      this.changeDrawOptions(canvasContext, drawOptions, () => {
        canvasContext.beginPath();
        const radius = Math.sqrt(
          Math.pow(options.startMouseX - options.offsetX, 2) +
            Math.pow(options.startMouseY - options.offsetY, 2)
        );
        canvasContext.arc(
          options.startMouseX,
          options.startMouseY,
          radius,
          0,
          2 * Math.PI
        );
        if (options.fill) {
          canvasContext.fill();
        } else {
          canvasContext.stroke();
        }
      });
    };
  }
}

export default Circle;

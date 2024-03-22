import { DrawOptions } from "@src/components/draw/core/types";
import Figure from "..";

class Rectangle extends Figure {
  name: string = "Rectangle";

  draw(
    canvasContext: CanvasRenderingContext2D,
    options: {
      offsetX: number;
      offsetY: number;
      startMouseX: number;
      startMouseY: number;
    },
    drawOptions: DrawOptions
  ) {
    this.canvasContext = canvasContext;
    this.drawOptions = drawOptions;
    this.calculateCoords(options);
    this.render = () => {
      this.changeDrawOptions(this.canvasContext!, this.drawOptions!, () => {
        if (this.drawOptions!.isFill) {
          this.canvasContext!.fillRect(
            this.x2,
            this.y2,
            this.x1 - this.x2,
            this.y1 - this.y2
          );
        } else {
          this.canvasContext!.strokeRect(
            this.x2,
            this.y2,
            this.x1 - this.x2,
            this.y1 - this.y2
          );
        }
      });
    };
  }
}

export default Rectangle;

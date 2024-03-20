import Shape from "./shape";
import { Coords } from "./type";

class Pencil extends Shape {
  pathCoords: Coords[];
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
    this.pathCoords = [{x: startX, y: startY}]
  }

  draw() {
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.stroke;
    this.ctx.lineCap = this.ctx.lineJoin = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    for(let i = 0; i < this.pathCoords.length; i++) {
      const { x, y } = this.pathCoords[i] as Coords;
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }

  mouseInShape(x: number, y: number) {
    return false;
  }

  addPath(x: number, y: number) {
    this.pathCoords.push({x, y})
  }
}

export default Pencil;

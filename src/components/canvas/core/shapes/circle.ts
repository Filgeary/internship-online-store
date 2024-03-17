import Shape from "./shape";

class Circle extends Shape {
  fill: boolean;
  startX: number;
  startY: number;
  radius: number | null = null;
  constructor(
    stroke: number,
    color: string,
    fill: boolean,
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number
  ) {
    super(stroke, color, ctx, offsetX, offsetY);
    this.fill = fill;
    this.startX = startX;
    this.startY = startY;
  }

  draw() {
    //создать новый путь для отображения окружности
    this.ctx.beginPath();
    //по теореме пифагора высчитывается радиус
    const radius = Math.sqrt(
      Math.pow(this.startX - this.offsetX, 2) +
        Math.pow(this.startY - this.offsetY, 2)
    );

    this.ctx.arc(this.startX, this.startY, this.radius ? this.radius : radius, 0, 2 * Math.PI);
    this.ctx.lineCap = "round";
    if (this.fill) {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.stroke;
      this.ctx.stroke();
    }
    this.radius = this.radius ? this.radius : radius;
  }

  move(x: number, y: number) {
    this.startX = x;
    this.startY = y;
  }

  mouseInShape(x: number, y: number) {
    const d = Math.sqrt(
      Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
    );

    return d < this.radius!;
  }
}

export default Circle;

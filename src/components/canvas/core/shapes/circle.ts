import Shape from "./shape";

class Circle extends Shape {
  radius: number | null = null;
  time: number = performance.now();
  speed: number = 0;

  draw(ctx: CanvasRenderingContext2D) {
    const path = new Path2D();
    //создать новый путь для отображения окружности
    ctx.beginPath();
    //по теореме пифагора высчитывается радиус
    this.radius = Math.sqrt(
      Math.pow(this.startX - this.offsetX, 2) +
        Math.pow(this.startY - this.offsetY, 2)
    );

    path.arc(this.startX, this.startY, this.radius, 0, 2 * Math.PI);
    ctx.lineCap = ctx.lineJoin = "round";
    if (this.fill) {
      ctx.fillStyle = this.color;
      ctx.fill(path);
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.stroke;
      ctx.stroke(path);
    }
  }

  override move(x: number, y: number) {
    const dx = this.startX - this.offsetX;
    const dy = this.startY - this.offsetY;
    this.startX = x;
    this.startY = y;
    this.offsetX = x - dx;
    this.offsetY = y - dy;
  }

  mouseInShape(x: number, y: number) {
    const d = Math.sqrt(
      Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
    );

    return d < this.radius!;
  }

  animate(time: number, height: number) {
    const duration = 2000;
    // Время с прошлого расчёта
    const dt = (time - this.time) / duration;
    if (this.offsetY <= height) {
      this.offsetY += this.speed * dt/10;
      this.startY += this.speed * dt/10;
      this.speed = this.speed + dt;
    }
  }
}

export default Circle;

import Shape from "./shape";

class Circle extends Shape {
  radius: number | null = null;
  time: number = performance.now();
  speed: number = 0

  draw() {
    //создать новый путь для отображения окружности
    this.ctx.beginPath();
    //по теореме пифагора высчитывается радиус
    const radius = Math.sqrt(
      Math.pow(this.startX - this.offsetX, 2) +
        Math.pow(this.startY - this.offsetY, 2)
        );
    this.radius = this.radius ? this.radius : radius;
    this.ctx.arc(
      this.startX,
      this.startY,
      this.radius,
      0,
      2 * Math.PI
    );
    this.ctx.lineCap = "round";
    if (this.fill) {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.stroke;
      this.ctx.stroke();
    }
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
      this.offsetY += this.speed * dt;
      this.startY += this.speed * dt;
      this.speed = this.speed + dt;
    }
  }
}

export default Circle;

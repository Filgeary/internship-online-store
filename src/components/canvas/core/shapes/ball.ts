export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  constructor(x: number, y: number, dx: number, dy: number, radius: number) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath()
  }

  update(ctx: CanvasRenderingContext2D, height:  number, width: number) {
    const gravity = 0.2;
    const friction = 0.98;
    if(this.y + this.dy + this.radius > height) {
      this.dy = -this.dy * friction;
      this.dx = this.dx * friction;
    } else {
      this.dy += gravity
    }

    if (this.x + this.radius >= width || this.x - this.radius <= 0) {
      this.dx = -this.dx * friction;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw(ctx);
  }
}

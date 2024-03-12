import Figure from "../figure";

class Circle extends Figure {

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if(this.color) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, 25, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.restore();
  }

  insideFigure(x: number, y: number): boolean {
    const dist = Math.sqrt((x - this.x)**2 + (y - this.y)**2);
    return dist <= 25;
  }
}

export default Circle;

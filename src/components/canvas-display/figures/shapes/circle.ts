import Figure from "../figure";

class Circle extends Figure {

  draw(ctx: CanvasRenderingContext2D) {
    const coords = this.getCoords();
    ctx.save();
    if(this.color) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 25, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.restore();
  }

  insideFigure(x: number, y: number): boolean {
    const coords = this.getCoords();
    const dist = Math.sqrt((x - coords.x)**2 + (y - coords.y)**2);
    return dist <= 25;
  }
}

export default Circle;

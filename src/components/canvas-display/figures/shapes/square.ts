import Figure from "../figure";

class Square extends Figure {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if(this.color) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }
    ctx.fillRect(this.x, this.y, 50, 50);
    ctx.restore();
  }

  insideFigure(x: number, y: number): boolean {
    if (x > this.x && x < this.x + 50 && y > this.y && y < this.y + 50) {
      return true;
    } else {
      return false;
    }
  }
}

export default Square;

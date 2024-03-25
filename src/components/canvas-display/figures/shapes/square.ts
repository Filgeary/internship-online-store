import Figure from "../figure";

class Square extends Figure {
  draw(ctx: CanvasRenderingContext2D) {
    const coords = this.getCoords();

    ctx.save();
    if(this.color) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }
    ctx.fillRect(coords.x, coords.y, 50, 50);
    ctx.restore();
  }

  insideFigure(x: number, y: number): boolean {
    const coords = this.getCoords();
    if (x > coords.x && x < coords.x + 50 && y > coords.y && y < coords.y + 50) {
      return true;
    } else {
      return false;
    }
  }
}

export default Square;

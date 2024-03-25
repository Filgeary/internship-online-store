import Figure from "../figure";

class Triangle extends Figure {

  draw(ctx: CanvasRenderingContext2D) {
    const coords = this.getCoords();

    ctx.save();
    if(this.color) {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineTo(coords.x + 50, coords.y);
    ctx.lineTo(coords.x + 25, coords.y - 35);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  insideFigure(x: number, y: number): boolean {
    function sign(px: number, py: number, v1x: number, v1y: number, v2x: number, v2y: number) {
      return (px - v2x) * (v1y - v2y) - (v1x - v2x) * (py - v2y)
    }

    const coords = this.getCoords();

    const ax = coords.x;
    const ay = coords.y;
    const bx = coords.x + 50;
    const by = coords.y;
    const cx = coords.x + 25;
    const cy = coords.y - 35;

    const a = sign(x, y, ax, ay, bx, by) < 0;
    const b = sign(x, y, bx, by, cx, cy) < 0;
    const c = sign(x, y, cx, cy, ax, ay) < 0;

    return ((a === b) && (b === c));
  }
}

export default Triangle;

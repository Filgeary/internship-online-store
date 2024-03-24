import { Rect } from "../../types";
import Figure from "../figure";

class Square extends Figure {
  width: number = 40;
  height: number = this.width;
  pause: boolean = false;
  time: number = performance.now();
  angle: number = 10;
  hover: boolean = false;
  vy: number = 1;

  animate(time: number) {
    // Время "жизни" фигуры
    const t = time - this.time;

    // Изменение угла без укореняем
    this.angle += 5;
    if (this.angle > 360 || this.angle < -360) this.angle = 0;
  }

  /**
   * Прямоугольная область элемента
   */
  getBoundRect(): Rect {
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.height,
    };
  }

  /**
   * Проверка попадания элемента в прямоугольную область
   * @param rect
   */
  isIntersectRect(rect: Rect) {
    const bound = this.getBoundRect();
    return (
      bound.x1 <= rect.x2 &&
      bound.x2 >= rect.x1 &&
      bound.y1 <= rect.y2 &&
      bound.y2 >= rect.y1
    );
  }
  setPause(pause = true) {
    this.pause = pause;
    this.time = performance.now();
  }

  setPosition({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }

  setHover(args: boolean) {
    this.hover = args;
  }

  insideFigure(x: number, y: number): boolean {
    if (x > this.x && x < this.x + 40 && y > this.y && y < this.y + 40) {
      return true;
    } else {
      return false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (this.color) {
      ctx.fillStyle = this.hover ? "#f5f5f5" : this.color;
      ctx.strokeStyle = this.color;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

export default Square;

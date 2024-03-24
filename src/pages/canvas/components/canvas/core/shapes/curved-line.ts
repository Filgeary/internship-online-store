import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class CurvedLine extends Shape {
  private points: any[];

  constructor(name: keysShape, startX: number, startY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color, endX?: number, endY?: number) {
    super(name, startX, startY, lineWidth, color, filling, fillingColor);
    this.points = [];
    this.points.push({x: startX, y: startY})
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.startX + this.centerX, this.startY + this.centerY);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round'
    ctx.lineWidth = this.lineWidth;
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x + this.centerX, this.points[i].y + this.centerY);
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  public movingWhileDrawing(x: number, y: number) {
    this.points.push({x: x - this.centerX, y: y - this.centerY})
  }

  // Переопределяем метод isPointInside для проверки, попадает ли точка внутрь кривой линии
  public isPointInside(x: number, y: number): boolean {
    // Для кривой линии считаем, что точка находится внутри, если она находится достаточно близко к любой из точек
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const distance = Math.sqrt((x - (point.x + this.centerX)) ** 2 + (y - (point.y + this.centerY)) ** 2);
      if (distance <= this.inaccuracy) {
        return true;
      }
    }
    return false;
  }

  public calculateCenter(): void {
    // Для кривой линии центральная точка будет зависеть от расположения её точек
    // Например, можно взять среднее арифметическое координат всех точек
    if (this.points?.length) {
      let sumX = 0;
      let sumY = 0;

      for (const point of this.points) {
        sumX += point.x;
        sumY += point.y;
      }

      this.centerX = sumX / this.points.length;
      this.centerY = sumY / this.points.length;
    }
  }

  public getDimensions(): { width: number; height: number } {
    if (this.points.length === 0) {
      return { width: 0, height: 0 };
    }

    let minX = this.points[0].x;
    let maxX = this.points[0].x;
    let minY = this.points[0].y;
    let maxY = this.points[0].y;

    for (const point of this.points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    const width = maxX - minX;
    const height = maxY - minY;

    return { width, height };
  }
}

export default CurvedLine;

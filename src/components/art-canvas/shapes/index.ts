import { TCoords, TShapeOptions } from './types';

abstract class Shape {
  id: string;
  name: string;
  ctx: CanvasRenderingContext2D;
  options: TShapeOptions;
  panOffset: TCoords;

  constructor(panOffset: TCoords) {
    this.id = window.crypto.randomUUID();
    this.panOffset = panOffset;
  }

  /**
   * Отрисовка фигуры
   */
  abstract draw(): void;

  /**
   * Проверка вхождения точки в фигуру
   */
  abstract mouseIn(coords: { x: number; y: number }): boolean;

  /**
   * Получить площадь фигуры
   */
  abstract getArea(): number;

  /**
   * Залить фигуру цветом
   */
  abstract fillArea(color: string, coords: TCoords, scale: number): void;
}

export default Shape;

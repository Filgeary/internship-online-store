import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";
import {generateUniqueCode} from "@src/shared/utils/unique-code";

abstract class Shape {
  // Описание фигур
  public lineWidth: number;
  public color: string;
  public filling: boolean;
  public fillingColor: Color | null;
  public uniqueID: string;
  public name: keysShape;

  // Начальные координаты
  public startX: number;
  public startY: number;

  // Позиции для перетаскивания фигру
  public dragOffsetX: number;
  public dragOffsetY: number;
  public centerX: number;
  public centerY: number;

  // Погрешность для попадания
  public inaccuracy: number;
  // Добавляем флаг для отслеживания перетаскивания фигуры
  public isDragging: boolean = false;

  constructor(name: keysShape, startX: number, startY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color, inaccuracy: number = 5) {
    this.startX = startX;
    this.startY = startY;

    this.centerX = 0;
    this.centerY = 0
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.lineWidth = lineWidth;
    this.color = color;
    this.filling = filling;
    this.fillingColor = fillingColor || null;
    this.inaccuracy = inaccuracy;
    this.name = name
    this.uniqueID = `${this.name}_${this.color}_${generateUniqueCode()}-${this.startX}_${this.startY}`
  }

  // Абстрактный метод для рисования на холсте
  abstract draw(ctx: CanvasRenderingContext2D): void;

  // Абстрактный метод, для рисования фигуры
  abstract movingWhileDrawing(x: number, y: number): void

  // Добавляем метод для проверки, попадает ли точка (x, y) внутрь фигуры
  abstract isPointInside(x: number, y: number): boolean;

  // Абстрактный метод для вычисления центра фигуры
  abstract calculateCenter(): void;

  // Абстрактный метод, для вычисления размеров фигуры
  abstract getDimensions(): {width: number, height: number}


  // Методы для начала, процесса и завершения перетаскивания фигуры
  public startDragging(x: number, y: number): Shape | undefined {
    if (this.isPointInside(x, y)) {
      // Сохраняем координаты мыши относительно центра фигуры
      this.dragOffsetX = x - this.centerX;
      this.dragOffsetY = y - this.centerY;
      this.isDragging = true;

      return this;
    }
  }

  // Перетаскивание фигуры, для всех фигур одиноковен
  public drag(x: number, y: number): void {
    if (this.isDragging) {
      this.calculateCenter();
      // Пересчитываем координаты центра фигуры на основе смещения относительно центра
      this.centerX = x - this.dragOffsetX;
      this.centerY = y - this.dragOffsetY;
    }
  }

  // Завершение рисования
  public endDragging(): void {
    this.isDragging = false;
  }

}

export default Shape;

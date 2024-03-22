import { ICircle, IRectangle, ILine, IFreeDraw } from "@src/store/canvas/types"
import Pointer from "../pointer"

export default class Fall extends Pointer {

    constructor(canvas: HTMLCanvasElement | null, shapes: (ICircle | IRectangle | ILine | IFreeDraw)[] | null) {
        super(canvas, shapes)
        this.startFallAnimation(); // Запускаем анимацию плавного падения фигур
    }

    startFallAnimation() {
      this.animation({
          update: (params) => {
              this.fallFiguresSmoothly(params.secondPart) // Обновляем положение фигур с учетом времени
          },
          render: () => {
              this.redrawCanvas() // Перерисовываем холст после обновления позиций фигур
          },
          clear: () => {
            this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height) // Очищаем холст перед отрисовкой нового кадра
          },
      });
  }

  // Метод для плавного падения всех фигур на canvas
  fallFiguresSmoothly(timeFraction: number) {
    console.log("this.shapes", this.shapes)
    if (!this.shapes) return;

    this.shapes.forEach((figure) => {
        
      if (figure.type === "rectangle") {
        const canvasBottom = this.canvas!.height - figure.height // Нижняя граница canvas для прямоугольника
        if (figure.y < canvasBottom) {
          figure.y += 1
        }
      }

      if (figure.type === 'circle') {
          const canvasBottom = this.canvas!.height - figure.radius // Нижняя граница canvas для круга
          if (figure.y < canvasBottom) {
            figure.y += 1 // Изменение координаты y для падения фигуры
          }
        }

        if (figure.type === 'line') {
          const canvasBottom = this.canvas!.height // Нижняя граница canvas для линии
          if (figure.startY < canvasBottom && figure.endY < canvasBottom) {
              figure.startY += 1 // Изменение координаты startY для падения линии
              figure.endY += 1// Изменение координаты endY для падения линии
          }
        }

        if (figure.type === 'freeDraw') {
          // Находим максимальное значение y среди всех точек этой фигуры. 
          // Если максимальное значение y меньше нижней границы canvas, то фигура остается на месте. 
          // Если максимальное значение y превышает нижнюю границу canvas, то все точки фигуры сдвигаются вниз так, 
          // чтобы фигура оказалась на нижней границе canvas.
          let maxY = -Infinity
          for (const point of figure.points) {
            if (point.y > maxY) {
              maxY = point.y
            }
          }
          const canvasBottom = this.canvas!.height
          if (maxY < canvasBottom) {
            // Сдвигаем все точки фигуры на deltaY
            for (const point of figure.points) {
              point.y += 1
            }
          }
        }
    })
  }
}
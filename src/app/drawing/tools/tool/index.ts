import { ICircle, IRectangle, ILine, IFreeDraw } from "@src/store/canvas/types"

interface AnimationParams {
    update: (params: AnimationParamsObject) => void
    render: (params: AnimationParamsObject) => void
    clear: () => void
}

interface AnimationParamsObject {
    diff: number
    timestamp: number
    pTimestamp: number
    fps: number
    secondPart: number
}

class Tool {
  canvas: HTMLCanvasElement | null
  ctx: CanvasRenderingContext2D | null
  allFiguresTool: (ICircle | IRectangle | ILine | IFreeDraw)[] | null
  animationId: any

  constructor(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas
    this.ctx = canvas ? canvas.getContext("2d") : null
    this.allFiguresTool = []
    this.destroyEvents()
    this.animationId
  }

  set fillColor(color: string | CanvasGradient | CanvasPattern) {
    this.ctx && (this.ctx.fillStyle = color)
  }
  set strokeColor(color: string | CanvasGradient | CanvasPattern) {
    this.ctx && (this.ctx.strokeStyle = color)
  }

  set lineWidth(width: number) {
    this.ctx && (this.ctx.lineWidth = width)
  }

  destroyEvents() {
    if (this.canvas) {
      this.canvas.onmousemove = null
      this.canvas.onmousedown = null
      this.canvas.onmouseup = null
    }
  }

  animation(params: AnimationParams) { // Объявление функции animation с параметром params
	const { update, render, clear } = params // Деструктуризация параметра params для получения функций update, render и clear
	let pTimestamp = 0 // Инициализация переменной pTimestamp, которая будет хранить предыдущее значение времени

	const tick = (timestamp: number) => { // Объявление функции tick с параметром timestamp
		this.animationId = requestAnimationFrame(tick) // Повторный вызов функции requestAnimationFrame с аргументом tick для обновления анимации
        console.log('timestamp', timestamp)

		const diff = timestamp - pTimestamp // Вычисление разницы между текущим и предыдущим временем анимации
		const fps = 1000 / diff // Вычисление количества кадров в секунду (FPS) на основе разницы времени
		const secondPart = diff / 1000 // Вычисление доли секунды, прошедшей с предыдущего кадра
		pTimestamp = timestamp // Обновление предыдущего времени до текущего

		const params = { // Создание объекта params со значениями разницы времени, временных меток, FPS и доли секунды
			diff,
			timestamp,
			pTimestamp,
			fps,
			secondPart,
		};

		update(params) // Вызов функции update с параметром params для обновления состояния анимации
		clear() // Вызов функции clear для очистки холста или экрана перед отрисовкой нового кадра
		render(params) // Вызов функции render с параметром params для отрисовки нового кадра анимации
	}

    requestAnimationFrame(tick) // Вызов функции requestAnimationFrame с аргументом tick для запуска анимации
}
}

export default Tool

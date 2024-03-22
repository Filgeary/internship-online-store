import { ILine } from "@src/store/canvas/types"
import Tool from "../tool"

class Line extends Tool {
    canvas!: HTMLCanvasElement | null 
    mouseDown!: boolean // Флаг, указывающий, нажата ли кнопка мыши
    currentX!: number
    currentY!: number
    saved: any
    figures: ILine | null

    constructor(canvas: HTMLCanvasElement | null) {
        super(canvas) // Вызываем конструктор родительского класса
        this.listen() // Устанавливаем обработчики событий для рисования
        this.figures = null
    }
    
    listen() {
       if(this.canvas) {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
       }
    }

    // Обработчик события отпускания кнопки мыши
    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
        const allFigures = this.allFiguresTool as any
        this.allFiguresTool = [...allFigures, this.figures]
    }

    // Обработчик события нажатия кнопки мыши
    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true 
        if(this.ctx && e.target instanceof HTMLElement) { 
          const rect = this.canvas!.getBoundingClientRect() // Получаем размеры и позицию холста
          this.currentX = e.clientX - rect.left
          this.currentY = e.clientY - rect.top
          this.ctx.beginPath()
          this.ctx.moveTo(this.currentX, this.currentY )
          this.saved = this.canvas!.toDataURL()

           // Сохраняем координаты линии
           this.figures = {
            type: 'line', 
            startX: this.currentX, 
            startY: this.currentY, 
            endX: this.currentX, 
            endY: this.currentY
        }
        }
    }

    // Обработчик события перемещения мыши
    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown  && e.target instanceof HTMLElement) {
            const rect = this.canvas!.getBoundingClientRect()
            const newX = e.clientX - rect.left
            const newY = e.clientY - rect.top
            this.draw(newX, newY) // Рисуем по текущим координатам
            // Обновляем конечные координаты линии
            this.figures!.endX = newX
            this.figures!.endY = newY
        }
    }

    // Рисование на холсте
   draw(x: number, y: number) {
       const img = new Image()
       img.src = this.saved
      
       // Сработает слушатель события onload в тот момент, когда изображение установилось
      img.onload = () => {
        this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height) // Очистка canvas
        this.ctx!.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height) // Вернули изображение, которое сохранили 
        this.ctx!.fillStyle = 'black'
        this.ctx!.beginPath() // Начинаем рисовать новую линию
        this.ctx!.moveTo(this.currentX, this.currentY)
        this.ctx!.lineTo(x, y)
        this.ctx!.fill()
        this.ctx!.stroke()
    }
}
}

export default Line
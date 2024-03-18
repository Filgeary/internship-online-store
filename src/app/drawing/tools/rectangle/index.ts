import Tool from "../tool"
// import { IRectangle } from "@src/store/canvas/types"
import { IRectangle } from "@src/store/canvas/types"

class Rectangle extends Tool {
    canvas!: HTMLCanvasElement | null // Ссылка на элемент canvas, к которому привязана кисть
    mouseDown!: boolean // Флаг, указывающий, нажата ли кнопка мыши
    startX!: number
    startY!: number
    saved: any
    rect: any
    figures: IRectangle | null

    constructor(canvas: HTMLCanvasElement | null) {
        super(canvas) // Вызываем конструктор родительского класса
        this.listen() // Устанавливаем обработчики событий для рисования
        this.rect = null
        this.figures = null
    }
    
    listen() {
       if(this.canvas) {
        // Устанавливаем обработчики событий для перемещения, нажатия и отпускания кнопки мыши

        // Использование .bind(this) в данном контексте гарантирует, что контекст (this) внутри обработчиков событий 
        // будет указывать на экземпляр класса Rectangle, а не на объект, на котором был вызван метод, 
        // который может измениться в зависимости от контекста вызова.
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
        this.mouseDown = true // Устанавливаем флаг нажатия кнопки мыши в true
        if(this.ctx && e.target instanceof HTMLElement) { // Проверяем наличие контекста рисования и что цель события является элементом HTML
          this.ctx.beginPath() // Начинаем новый путь рисования
          const rect = this.canvas!.getBoundingClientRect() // Получаем размеры и позицию холста
        
          // Получаем стартовые координаты по x и по y
          this.startX = e.clientX - rect.left
          this.startY = e.clientY - rect.top

          // Сохранение изображения с canvas
          this.saved = this.canvas!.toDataURL()
        }
    }

    // Обработчик события перемещения мыши
    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown  && e.target instanceof HTMLElement) {
            const rect = this.canvas!.getBoundingClientRect()
            let currentX = e.clientX - rect.left
            let currentY = e.clientY - rect.top
            let width = currentX - this.startX
            let height = currentY - this.startY
            this.figures = {
                type: 'rectangle', 
                x: this.startX, 
                y: this.startY, 
                width: width, 
                height:height
            }
            this.draw(this.startX, this.startY, width, height) // Рисуем по указанным координатам
        }
    }

    // Рисование на холсте
   draw(x: number, y: number, w: number, h: number) {
       const img = new Image()
       img.src = this.saved
      
       // Сработает слушатель события onload в тот момент, когда изображение установилось
      img.onload = () => {
        this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height) // Очистка canvas
        this.ctx!.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height) // Вернули изображение, которое сохранили 
        this.ctx!.beginPath() // Начинаем рисовать новую фигуру
        this.ctx!.rect(x, y, w, h)
        this.ctx!.fill() // Заливка цветом
        this.ctx!.stroke() // Добавляем обводку
       }
    }
}

export default Rectangle
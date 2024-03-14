import Tool from "../tool"

class Brush extends Tool {
    canvas!: HTMLCanvasElement | null // Ссылка на элемент canvas, к которому привязана кисть
    mouseDown!: boolean // Флаг, указывающий, нажата ли кнопка мыши

    constructor(canvas: HTMLCanvasElement | null) {
        super(canvas) // Вызываем конструктор родительского класса
        this.listen() // Устанавливаем обработчики событий для рисования
    }
    
    listen() {
       if(this.canvas) {
        // Устанавливаем обработчики событий для перемещения, нажатия и отпускания кнопки мыши

        // Использование .bind(this) в данном контексте гарантирует, что контекст (this) внутри обработчиков событий 
        // будет указывать на экземпляр класса Brush, а не на объект, на котором был вызван метод, 
        // который может измениться в зависимости от контекста вызова.
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
       }
    }

    // Обработчик события отпускания кнопки мыши
    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
    }

    // Обработчик события нажатия кнопки мыши
    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true // Устанавливаем флаг нажатия кнопки мыши в true
        if(this.ctx && e.target instanceof HTMLElement) { // Проверяем наличие контекста рисования и что цель события является элементом HTML
            this.ctx.beginPath() // Начинаем новый путь рисования
            const rect = this.canvas!.getBoundingClientRect() // Получаем размеры и позицию холста
            this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top) // Используем clientX и clientY относительно холста
            // e.target && this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

    // Обработчик события перемещения мыши
    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown  && e.target instanceof HTMLElement) {
            const rect = this.canvas!.getBoundingClientRect()
            this.draw(e.clientX - rect.left, e.clientY - rect.top) // Рисуем по указанным координатам
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop) 
        }
    }

    // Рисование на холсте
   draw(x: number, y: number) {
    if(this.ctx) { // Проверяем наличие контекста рисования
      this.ctx.lineTo(x, y) // Проводим линию к указанным координатам
      this.ctx.stroke() // Отрисовываем линию
    }
}
}

export default Brush
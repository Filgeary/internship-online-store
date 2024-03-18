import { ICircle, IRectangle, ILine, IFreeDraw } from "@src/store/canvas/types"

class Tool {
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null 
    allFiguresTool: (ICircle | IRectangle | ILine | IFreeDraw)[] | null

    constructor(canvas: HTMLCanvasElement | null) {
      this.canvas = canvas
      this.ctx = canvas ? canvas.getContext('2d') : null
      this.destroyEvents()
      this.allFiguresTool = []
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
        if(this.canvas) {
            this.canvas.onmousemove = null
            this.canvas.onmousedown = null
            this.canvas.onmouseup = null
        }
    }

    // Метод для отрисовки всех фигур на canvas
    drawFigures(figures: any) {
    if(this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        figures.forEach(function(figure: any) {
        figure.draw()
    })
    }
}
}

export default Tool
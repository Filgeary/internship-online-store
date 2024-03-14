class Tool {
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null 

    constructor(canvas: HTMLCanvasElement | null) {
      this.canvas = canvas
      this.ctx = canvas ? canvas.getContext('2d') : null
      this.destroyEvents()
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
}

export default Tool
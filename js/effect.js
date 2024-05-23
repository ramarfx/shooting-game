export class Effect {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 80
        this.markedForDeletion = false
        this.image = document.getElementById('boom')
    }
    draw(context){
        context.drawImage(this.image, this.x - this.size /2, this.y - this.size /2, this.size, this.size)
    }
    update(){
        this.size *= 0.95
        if (this.size < 50) {
            this.markedForDeletion = true
        }
    }
}
export class Cursor {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.image = document.getElementById('pointer')
    }

    draw(context) {
        context.drawImage(this.image, this.x - 53 / 2, this.y - 53 / 2, 53, 53)
    }

    update(x, y) {
        this.x = x
        this.y = y
    }
}
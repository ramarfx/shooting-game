export class Gun {
    constructor(game, type) {
        this.game = game
        this.type = type
    }

    draw(context) {
        let image;
        if (this.type === 'gun1') {
            image = document.getElementById('gun1')
        } else if (this.type === 'gun2') {
            image = document.getElementById('gun2')
        }

        context.drawImage(image, this.game.width / 2, this.game.height - 300, 300, 300)
    }
}
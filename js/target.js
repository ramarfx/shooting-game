export class Target {
    constructor(game, image) {
        this.game = game
        this.image = image
        this.width = 148
        this.height = 148
        this.x = (Math.random() * (this.game.width - 148) - 148) + 148
        this.y = Math.random() * (this.game.height - 200)
    }

    draw(context){
        let currentImage 
        if (this.image === 'target1') {
            currentImage = document.getElementById('target1')
        } else if (this.image === 'target2'){
            currentImage = document.getElementById('target2')
        } else if (this.image === 'target3'){
            currentImage = document.getElementById('target3')
        }

        context.drawImage(currentImage, this.x, this.y, this.width, this.height)
    }
    update(){

    }
}

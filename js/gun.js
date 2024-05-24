export class Gun {
    constructor(game, type) {
        this.game = game
        this.type = type
        this.isGun1 = this.type === 'gun1'
    }

    draw(context) {
        let image;
        if (this.type === 'gun1') {
            image = document.getElementById('gun1')
            this.isGun1 = true
        } else if (this.type === 'gun2') {
            image = document.getElementById('gun2')
            this.isGun1 = false
        }

        context.drawImage(image, this.game.width / 2, this.game.height - 300, 300, 300)
    }
    update(context){
        window.onkeyup = (e) => {
          if (e.code === 'ControlLeft') {
            if (this.isGun1){
              this.image = document.getElementById('gun2')
              this.isGun1 = false
            } else {
                this.image = document.getElementById('gun1')
                this.isGun1 = true
            }
          }

          this.draw(context)
        }
    }
}
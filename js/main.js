import { Cursor } from "./cursor.js"
import { Effect } from "./effect.js"
import { Gun } from "./gun.js"
import { Target } from "./target.js"

window.onload = () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 1000
    canvas.height = 600

    const username = localStorage.getItem('username')
    const gun = localStorage.getItem('gun')
    const target = localStorage.getItem('target')

    const mouse = {
        x: 10,
        y: 10,
        width: 0.1,
        height: 0.1,
        isClicked: false
    }

    let canvasPosition = canvas.getBoundingClientRect()
    canvas.onmousemove = (e) => {
        mouse.x = e.x - canvasPosition.left
        mouse.y = e.y - canvasPosition.top
    }
    canvas.onmouseleave = (e) => {
        mouse.x = undefined
        mouse.y = undefined
    }
    canvas.onmousedown = () => {
      mouse.isClicked = true
    }
    canvas.onmouseup = () => {
      mouse.isClicked = false
    }

    class Game {
        constructor() {
            this.width = canvas.width
            this.height = canvas.height
            this.gun = new Gun(this, gun)
            this.targets = [new Target(this, target), new Target(this, target), new Target(this, target)]
            this.effects = []
            this.cursor = new Cursor(mouse.x, mouse.y)
            this.score = 0
            this.time = 0
            this.durationEffect = 0
        }

        draw() {
            const background = document.getElementById('background')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            this.targets.forEach((target) => {
                target.draw(ctx)
            })
            this.effects.forEach((effect) => {
              effect.draw(ctx)
            })
            this.gun.draw(ctx)
            this.cursor.draw(ctx)
        }
        update(deltaTime) {
            this.time += deltaTime

            console.log(mouse.x, mouse.y);

            if (this.time > 3000) {
                this.targets.push(new Target(this, target))

                this.time = 0
            } else {
                this.time += deltaTime
            }

            this.targets.forEach((target) => {
                if (mouse.isClicked && checkCollision(mouse, target)) {
                    this.score += 10
                    this.targets.splice(this.targets.indexOf(target), 1);
                    this.effects.push(new Effect(mouse.x, mouse.y))
                }
            })
            this.effects.forEach((effect, index) => {
              effect.update()
              if (effect.markedForDeletion) this.effects.splice(index, 1)
            })
            this.cursor.update(mouse.x, mouse.y)
        }
    }

    const game = new Game()
    let lastTime = 0

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime
        lastTime = timestamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        game.draw()
        game.update(deltaTime)

        requestAnimationFrame(animate)
    }

    function checkCollision(a, b) {
        if (
            a.x + a.width > b.x &&
            a.x < b.x + b.width &&
            a.y + a.height > b.y &&
            a.y < b.y + b.height
        ) {
            return true
        } else {
            return false
        }
    }

    animate(0)
}
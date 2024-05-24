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
    const level = localStorage.getItem('level')
    let users = JSON.parse(localStorage.getItem('users')) || []

    const pauseElement = document.getElementById('pause')

    users.forEach((user) => {
        createElement(user.username, user.score);
    })

    document.getElementById('username').innerText = username;

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
            if (level === 'easy') {
                this.duration = 30 * 1000
            } else if (level === 'medium') {
                this.duration = 20 * 1000
            } else if (level === 'hard') {
                this.duration = 15 * 1000
            }
            this.gameOver = false
            this.elementAdded = false
            this.startTime = 4 * 1000
            this.isPaused = false
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
            if (this.gameOver) {
                ctx.fillStyle = 'red'
                ctx.font = '50px Arial'
                ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2)

                if (!this.elementAdded) {


                    const user = {
                        username: username,
                        score: this.score
                    }

                    const existingUser = users.find(_user => _user.username === user.username)
                    console.log(existingUser);

                    if (existingUser) {
                        existingUser.score = user.score;
                    } else {
                        users.push(user)
                        createElement(username, this.score)
                    }

                    localStorage.setItem('users', JSON.stringify(users));

                    this.elementAdded = true
                }

                return
            }
            // start game
            if (this.startTime > 0) {
                ctx.fillStyle = 'black'
                ctx.font = '50px Arial'
                ctx.fillText(`${Math.floor(this.startTime / 1000)}`, canvas.width / 2 - 50, canvas.height / 2)
            }

            this.startTime -= deltaTime

            // pause game
            window.onkeydown = (e) => {
              if (e.code === 'Escape') {
                this.isPaused = !this.isPaused
                pauseElement.classList.toggle('active')
              }
            }
            const pauseBtn = document.getElementById('pause-btn')
            pauseBtn.onclick = () => {
              this.isPaused = false
              pauseElement.classList.remove('active')
            }
            
            if (this.startTime < 0 && !this.isPaused) {
                this.time += deltaTime

                document.getElementById('score').innerText = `Score: ${this.score}`;
                document.getElementById('duration').innerText = `Duration: 00:${Math.floor(this.duration / 1000)}`;

                this.duration -= deltaTime

                if (this.duration <= 0) {
                    this.gameOver = true
                }

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
                this.gun.update(ctx)
            }
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

    function createElement(_username, _score) {
        const username = document.createElement('p');
        username.className = 'username';
        const usernameText = document.createTextNode(_username);
        username.appendChild(usernameText);

        const score = document.createElement('p');
        score.className = 'score';
        const scoreText = document.createTextNode(`Score: ${_score}`);
        score.appendChild(scoreText);

        const div = document.createElement('div');
        div.appendChild(username);
        div.appendChild(score);

        const button = document.createElement('button');
        button.className = 'detail-btn';
        button.textContent = 'Detail';

        const li = document.createElement('li');
        li.appendChild(div);
        li.appendChild(button);

        const ul = document.getElementById('users');
        if (ul) {
            ul.appendChild(li);
        } else {
            console.error("Element with id 'users' not found.");
        }
    }

    window.onresize = () => {
        canvasPosition = canvas.getBoundingClientRect()
    }

    animate(0)
}
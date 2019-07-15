class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = "main";
        this.canvas.width = Const.WIDTH * Const.SCALE;
        this.canvas.height = Const.HEIGHT * Const.SCALE;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(Const.SCALE, Const.SCALE);

        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1 / 60;

        this.loop = (time) => {
            this.accumulator += (time - this.lastTime) / 1000;
            while (this.accumulator > this.deltaTime) {
                this.accumulator -= this.deltaTime;
                this.state.update(Math.min(this.deltaTime, .5));
            }

            this.lastTime = time;

            this.ctx.clearRect(0, 0, Const.WIDTH, Const.HEIGHT);
            this.state.draw(this.ctx);
            requestAnimationFrame(this.loop);
        }

        this.tetris = new Tetris();
        this.state = this.tetris;
        this.state.start();

        window.addEventListener("stateChange", (e) => {
            switch (e.detail.state) {
                case Const.GAME:
                    this.state = this.tetris;
                    break;
                case Const.MENU:
                    //this.state = this.menu;
                    break;
                case Const.GAMEOVER:
                    //this.state = this.go;
                    break;
            }
            this.state.start();
        });

        this.loop(0);
    }

    touch(i) {
        this.state.input(i);
    }
}

const K = new Keyboard();
const R = new Resources(() => new Game());
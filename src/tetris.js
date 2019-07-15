class Tetris extends State {
    constructor() {
        super();
        this.pentominos = [
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0, 0],
            [1, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 0, 0, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 0, 0, 0],
            [1, 1, 0, 1, 1, 0, 0, 0, 0]
        ];

        this.bag = [];
        this.board = [];
        this.lines = [];
        this.explodeTime = this.py = this.dropTime = this.rotation = this.score = this.lineCounter = 0;
        this.nextPiece = 0;
        this.px = 4;
        this.speed = this.level = 1;
        this.nxLvl = 0;
        this.gameState = this.oldState = GState.PLAYING;
        this.spanS = document.getElementById("score");
        this.spanL = document.getElementById("lines");
        this.spanV = document.getElementById("level");

        this.canvas = document.createElement('canvas');
        this.canvas.id = "next";
        this.canvas.height = this.canvas.width = Const.NXT_S * Const.TILE * Const.SCALE;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(Const.SCALE, Const.SCALE);

        for (let y = 0; y < Const.TY; y++) {
            this.board[y] = [];
            for (let x = 0; x < Const.TX; x++) {
                if (x == 0 || x == Const.TX - 1 || y == Const.TY - 1) this.board[y][x] = 8;
                else this.board[y][x] = 0;
            }
        }

        K.clear();
        K.addKey(32, (e) => {
            if (e === Const.PRESSED) {
                this.input(5);
            }
        });
        K.addKey(37, (e) => {
            if (e === Const.PRESSED) {
                this.input(3);
            }
        });
        K.addKey(38, (e) => {
            if (e === Const.PRESSED) {
                this.input(1);
            }
        });
        K.addKey(39, (e) => {
            if (e === Const.PRESSED) {
                this.input(4);
            }
        });
        K.addKey(40, (e) => {
            if (e === Const.PRESSED) {
                this.input(2);
            }
        });
        K.addKey(80, (e) => {
            if (e === Const.PRESSED) {
                this.input(6);
            }
        });
        K.addKey(82, (e) => {
            if (e === Const.PRESSED) {
                this.input(7);
            }
        });

        //this.setupBtns();
        this.getCurrent();
    }

    restart() {
        for (let y = 1; y < Const.TY - 1; y++) {
            for (let x = 1; x < Const.TX - 1; x++) {
                this.board[y][x] = 0;
            }
        }

        this.speed = this.level = 1;
        this.score = this.lineCounter = this.nxLvl = 0;
        this.gameState = this.oldState = GState.PLAYING;

        this.fillBag();
        this.getCurrent();
    }

    setupBtns() {
        document.getElementById("up").addEventListener('click', () => {
            this.input(1)
        });
        document.getElementById("left").addEventListener('click', () => {
            this.input(3)
        });
        document.getElementById("right").addEventListener('click', () => {
            this.input(4)
        });
        document.getElementById("down").addEventListener('click', () => {
            this.input(2)
        });
        document.getElementById("space").addEventListener('click', () => {
            this.input(5)
        });
        document.getElementById("pause").addEventListener('click', () => {
            this.input(6)
        });
    }

    getCurrent() {
        if (this.bag.length < 1) this.fillBag();
        this.current = this.bag.shift();
        if (this.bag.length < 1) this.fillBag();
        this.nextPiece = this.bag[0];

        this.px = 4;
        this.py = 0;
        this.rotation = 0;
    }

    fillBag() {
        this.bag = [0, 1, 2, 3, 4, 5, 6];
        for (let r = 0; r < 3; r++) {
            for (let i = 6; i > -1; i--) {
                let j = Math.floor(Math.random() * i);
                let t = this.bag[i];
                this.bag[i] = this.bag[j];
                this.bag[j] = t;
            }
        }
    }

    canMove(dx, dy) {
        let t = this.current === 0 ? 4 : 3;
        for (let j = 0; j < t; j++) {
            let ty = this.py + dy + j;
            for (let i = 0; i < t; i++) {
                let tx = this.px + dx + i;
                if (this.getPiece(i, j) && this.board[ty][tx] !== 0) return false;
            }
        }
        return true;
    }

    drop() {
        if (this.canMove(0, 1)) {
            this.py++;
            this.dropTime = 0;
            return true;
        }
        return false;
    }

    getPiece(i, j) {
        let t = 3,
            a = 6,
            b = 8,
            c = 2;
        switch (this.current) {
            case 6:
                this.rotation = 0;
                break;
            case 0:
                t = 4;
                a = 12;
                b = 15;
                c = 3;
                break;
        }

        switch (this.rotation) {
            case 0:
                return this.pentominos[this.current][i + t * j];
            case 1:
                return this.pentominos[this.current][a + j - t * i];
            case 2:
                return this.pentominos[this.current][b - t * j - i];
            case 3:
                return this.pentominos[this.current][c + t * i - j];
        }
        return 0;
    }

    newPiece() {
        let t = this.current === 0 ? 4 : 3;
        for (let j = 0; j < t; j++) {
            for (let i = 0; i < t; i++) {
                if (this.getPiece(i, j)) {
                    this.board[this.py + j][this.px + i] = this.current + 1;
                }
            }
        }

        this.lines = [];
        let found;
        for (let y = this.py; y < Const.TY - 1; y++) {
            found = true;
            for (let x = 1; x < Const.TX - 1; x++) {
                if (this.board[y][x] < 1) {
                    found = false;
                    break;
                }
            }
            if (found) this.lines.push(y);
        }

        if (this.lines.length > 0) {
            this.lines.forEach(w => {
                for (let x = 1; x < Const.TX - 1; x++) {
                    this.board[w][x] = Grfx.FLASH - 1;
                }
            });
            this.gameState = GState.EXPLODING;
        }
        this.getCurrent();

        if (!this.canMove(0, 1)) this.gameState = GState.OVER;
    }

    input(d) {
        if (d !== 7 && this.gameState === GState.OVER) return;
        switch (d) {
            case 1:
                let r = this.rotation;
                this.rotation = (this.rotation + 1) % 4;
                if (!this.canMove(0, 0)) this.rotation = r;
                break;
            case 2:
                if (!this.drop()) {
                    newPiece();
                }
                break;
            case 3:
                if (this.canMove(-1, 0)) this.px--;
                break;
            case 4:
                if (this.canMove(1, 0)) this.px++;
                break;
            case 5:
                this.gameState = GState.FALLING;
                break;
            case 6:
                if (this.gameState === GState.PAUSE) {
                    this.gameState = this.oldState;
                } else {
                    this.oldState = this.gameState;
                    this.gameState = GState.PAUSE;
                }
                break;
            case 7:
                this.restart();
                break;
        }
    }

    update(dt) {
        switch (this.gameState) {
            case GState.PAUSE:
                //
                break;
            case GState.PLAYING:
                this.dropTime += dt;
                if (this.dropTime > this.speed) {
                    if (!this.drop()) {
                        this.newPiece();
                    }
                }
                break;
            case GState.EXPLODING:
                if ((this.explodeTime += dt) > .15) {
                    this.explodeTime = 0;
                    this.gameState = GState.PLAYING;
                    this.lines.forEach(w => {
                        for (let x = 1; x < Const.TX - 1; x++) {
                            for (let y = w; y > 0; y--) {
                                this.board[y][x] = this.board[y - 1][x];
                            }
                        }
                    });

                    this.lineCounter += this.lines.length;
                    this.nxLvl += this.lines.length;

                    if (this.nxLvl > 20) {
                        this.nxLvl -= 20;
                        this.level++;
                        this.speed -= .05;
                        if (this.speed < .05) this.speed = .05;
                    }
                    this.score += this.lines.length * this.lines.length * 100;
                    this.spanS.innerHTML = this.score;
                    this.spanL.innerHTML = this.lineCounter;
                    this.spanV.innerHTML = this.level;
                }
                break;
            case GState.FALLING:
                if (!this.drop()) {
                    this.gameState = GState.PLAYING;
                    this.newPiece();
                }
                break;
            case GState.OVER:
                //
                break;
        }
    }

    draw(ctx) {
        for (let y = 0; y < Const.TY; y++) {
            for (let x = 0; x < Const.TX; x++) {
                ctx.drawImage(R.images[Grfx.GRID + this.board[y][x]], x * 27, y * 27);
            }
        }

        let t = this.py;
        while (this.canMove(0, 1)) {
            this.py++;
        }
        let ny = this.py;
        this.py = t;

        t = this.current === 0 ? 4 : 3;
        let ox = this.px * Const.TILE,
            oy = ny * Const.TILE;
        for (let j = 0; j < t; j++) {
            for (let i = 0; i < t; i++) {
                if (this.getPiece(i, j)) {
                    ctx.drawImage(R.images[Grfx.MARK], i * Const.TILE + ox, j * Const.TILE + oy);
                }
            }
        }

        ox = this.px * Const.TILE;
        oy = this.py * Const.TILE;
        for (let j = 0; j < t; j++) {
            for (let i = 0; i < t; i++) {
                if (this.getPiece(i, j)) {
                    ctx.drawImage(R.images[Grfx.BLUE + this.current], i * Const.TILE + ox, j * Const.TILE + oy);
                }
            }
        }

        for (let y = 0; y < Const.NXT_S; y++) {
            for (let x = 0; x < Const.NXT_S - 1; x++) {
                let g = x === 0 || x === Const.NXT_S - 2 || y === 0 || y === Const.NXT_S - 1 ? Grfx.GREY : Grfx.GRID;
                this.ctx.drawImage(R.images[g], x * 27, y * 27);
            }
        }

        let ct = 2 * Const.TILE;
        t = this.nextPiece === 0 ? 4 : 3;
        for (let j = 0; j < t; j++) {
            for (let i = 0; i < t; i++) {
                if (this.pentominos[this.nextPiece][i + t * j]) {
                    this.ctx.drawImage(R.images[Grfx.BLUE + this.nextPiece], i * Const.TILE + ct, j * Const.TILE + ct);
                }
            }
        }
    }
}

const Const = {
    TILE: 27,
    TX: 12,
    TY: 22,
    WIDTH: 27 * 12, 
    HEIGHT: 27 * 22,
    SCALE: 1,
    TWO_PI: Math.PI * 2,
    NXT_S: 8,

    GAME: 101, 
    MENU: 102,
    GAMEOVER: 103,

    PRESSED: 1,
    RELEASED: 2
};

const Grfx = {
    MARK: 0,
    GRID: 1,
    BLUE: 2,
    GREEN: 3,
    YELLOW: 4,
    LILA: 5,
    ORANGE: 6,
    RED: 7,
    CYAN: 8,
    GREY: 9,
    FLASH: 10
};

const GState = {
    PLAYING: 1,
    EXPLODING: 2,
    FALLING: 3,
    OVER: 4,
    PAUSE: 5
};

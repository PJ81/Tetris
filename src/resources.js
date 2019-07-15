

class Resources {
    constructor(cb) {
        this.images = new Array(35);
        
        Promise.all([
            (loadImage("./img/mark.gif")).then((i) => {this.images[Grfx.MARK] = i;}),
            (loadImage("./img/grid.gif")).then((i) => {this.images[Grfx.GRID] = i;}),
            (loadImage("./img/1.gif")).then((i) => {this.images[Grfx.BLUE] = i;}),
            (loadImage("./img/2.gif")).then((i) => {this.images[Grfx.GREEN] = i;}),
            (loadImage("./img/3.gif")).then((i) => {this.images[Grfx.YELLOW] = i;}),
            (loadImage("./img/4.gif")).then((i) => {this.images[Grfx.LILA] = i;}),
            (loadImage("./img/5.gif")).then((i) => {this.images[Grfx.ORANGE]= i;}),
            (loadImage("./img/6.gif")).then((i) => {this.images[Grfx.RED]= i;}),
            (loadImage("./img/7.gif")).then((i) => {this.images[Grfx.CYAN] = i;}),
            (loadImage("./img/8.gif")).then((i) => {this.images[Grfx.GREY] = i;}),
            (loadImage("./img/9.gif")).then((i) => {this.images[Grfx.FLASH] = i;})
        ]).then(() => {
            cb();
        });
    }

    image(index) {
        if(index < this.images.length) {
            return this.images[index];
        }
        return null;
    }
}
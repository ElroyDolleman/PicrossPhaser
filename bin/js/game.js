const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene', active: true });
    }
    preload() {
        this.load.spritesheet('picross-main-sheet', 'assets/picross_sheet.png', { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE });
    }
    create() {
        this.board = new Board(8, 8);
        this.board.createSprites(this);
    }
    update() {
    }
    resize() {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        }
        else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
}
var config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#e9f4fc',
    parent: 'picross',
    disableContextMenu: true,
    scene: [GameScene]
};
var game = new Phaser.Game(config);
const CELL_SIZE = 32;
var TileFrames;
(function (TileFrames) {
    TileFrames[TileFrames["Empty"] = 16] = "Empty";
    TileFrames[TileFrames["Marked"] = 17] = "Marked";
    TileFrames[TileFrames["Cross"] = 19] = "Cross";
})(TileFrames || (TileFrames = {}));
class Board {
    get boardPixelWitdh() { return CELL_SIZE * this.gridSize.x; }
    get boardPixelHeight() { return CELL_SIZE * this.gridSize.y; }
    get boardLeft() { return SCREEN_WIDTH / 2 - this.boardPixelWitdh / 2; }
    get boardTop() { return SCREEN_HEIGHT / 2 - this.boardPixelHeight / 2; }
    get tilesAmount() { return this.gridSize.x * this.gridSize.y; }
    constructor(rowLength, columnLength) {
        this.gridSize = new Phaser.Geom.Point(rowLength, columnLength);
    }
    createSprites(scene) {
        var groupConfig = {
            key: "picross-main-sheet",
            frame: TileFrames.Empty,
            frameQuantity: this.tilesAmount,
            gridAlign: {
                x: CELL_SIZE / 2 + this.boardLeft,
                y: CELL_SIZE / 2 + this.boardTop,
                width: this.gridSize.x,
                height: this.gridSize.y,
                cellWidth: CELL_SIZE,
                cellHeight: CELL_SIZE
            }
        };
        scene.add.group(groupConfig);
    }
}
var TileStates;
(function (TileStates) {
    TileStates[TileStates["Unrevealed"] = 0] = "Unrevealed";
    TileStates[TileStates["MarkedAsBlank"] = 1] = "MarkedAsBlank";
    TileStates[TileStates["Revealed"] = 2] = "Revealed";
    TileStates[TileStates["Mistake"] = 3] = "Mistake";
})(TileStates || (TileStates = {}));
class Tile {
    constructor(backSprite, isColored) {
        this.state = TileStates.Unrevealed;
        this.isColored = isColored;
        this.backSprite = backSprite;
    }
    isMarkedAsBlank() { return this.state == TileStates.MarkedAsBlank; }
    isInteractive() { return this.state == TileStates.Unrevealed || this.state == TileStates.MarkedAsBlank; }
    markAsBlank() {
        if (!this.isMarkedAsBlank) {
            this.changeState(TileStates.MarkedAsBlank);
        }
        else {
            this.changeState(TileStates.Unrevealed);
        }
    }
    reveal() {
        if (this.isMarkedAsBlank) {
            return;
        }
        if (this.isColored) {
            this.changeState(TileStates.Revealed);
        }
        else {
            this.changeState(TileStates.Mistake);
        }
    }
    changeState(newState) {
        this.state = newState;
    }
}
//# sourceMappingURL=game.js.map
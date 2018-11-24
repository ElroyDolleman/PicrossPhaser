class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene', active: true });
    }
    preload() {
        this.load.spritesheet('picross-main-sheet', 'assets/picross_sheet.png', { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE });
    }
    create() {
        this.board = new Board();
        this.board.create(this, Pictures.Heart);
    }
    update() {
        this.updateInput();
    }
    updateInput() {
        if (this.input.activePointer.justDown) {
            // Get the grid location of the pointer
            let pointerGridPos = this.board.toGridPosition(this.input.activePointer.x, this.input.activePointer.y);
            // Reveal the tile and check if the player is correct
            let correct = this.board.revealTile(pointerGridPos);
            // When the tile is revealed and it was correct
            if (correct === true) {
                console.log("Correct");
            }
            // When the tile is revealed but it was a mistake
            else if (correct === false) {
                console.log("Wrong");
            }
            // When the player didn't click on an unrevealed tile
            else {
            }
        }
    }
    resize() {
        var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
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
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
/// <reference path="scenes/gamescene.ts"/>
/// <reference path="settings.ts"/>
var config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#e9f4fc',
    parent: 'picross',
    title: "Picross",
    version: "1.0.0",
    disableContextMenu: true,
    scene: [GameScene]
};
var game = new Phaser.Game(config);
const CELL_SIZE = 32;
class Board {
    get boardPixelWitdh() { return CELL_SIZE * this.gridSize.x; }
    get boardPixelHeight() { return CELL_SIZE * this.gridSize.y; }
    get boardLeft() { return SCREEN_WIDTH / 2 - this.boardPixelWitdh / 2; }
    get boardTop() { return SCREEN_HEIGHT / 2 - this.boardPixelHeight / 2; }
    get tilesAmount() { return this.gridSize.x * this.gridSize.y; }
    constructor() {
    }
    create(scene, picture) {
        // Determine the gridsize based on the picture
        this.gridSize = new Phaser.Geom.Point(picture.length, picture[0].length);
        this.tiles = Array();
        this.tilesToBeRevealed = 0;
        for (let y = 0; y < this.gridSize.y; y++) {
            // Add a new row
            this.tiles.push(new Array());
            for (let x = 0; x < this.gridSize.x; x++) {
                // Add a new Tile
                this.tiles[y].push(new Tile(scene, this.toScreenPosition(x, y), !!picture[y][x]));
                // It adds 1 if the tile must be revealed and 0 if not
                this.tilesToBeRevealed += picture[y][x];
            }
        }
    }
    // createTileSprites(scene: Phaser.Scene): Phaser.GameObjects.Group
    // {
    //     var groupConfig: GroupCreateConfig = {
    //         key: "picross-main-sheet",
    //         frame: TileFrames.Empty,
    //         frameQuantity: this.tilesAmount,
    //         gridAlign: {
    //             x: CELL_SIZE / 2 + this.boardLeft,
    //             y: CELL_SIZE / 2 + this.boardTop,
    //             width: this.gridSize.x,
    //             height: this.gridSize.y,
    //             cellWidth: CELL_SIZE,
    //             cellHeight: CELL_SIZE
    //         }
    //     };
    //     return scene.add.group(groupConfig);
    // }
    revealTile(gridpos) {
        let tile = this.getTile(gridpos.x, gridpos.y);
        // If the player clicked on a valid tile
        if (tile != null && tile.isInteractive) {
            // Reveal the tile and return whether it was correct or not
            if (tile.reveal()) {
                this.tilesToBeRevealed--;
                console.log(this.tilesToBeRevealed);
                return true;
            }
            return false;
        }
        // If nothing was revealed, then there was no mistake
        return null;
    }
    markTile(gridpos) {
        let tile = this.getTile(gridpos.x, gridpos.y);
        if (tile != null) {
            tile.markAsBlank();
        }
    }
    getTile(x, y) {
        if (x < 0 || x >= this.gridSize.x || y < 0 || y >= this.gridSize.y) {
            return null;
        }
        return this.tiles[y][x];
    }
    // Converts a screen position to a location in the grid
    toGridPosition(screenPosX, screenPosY) {
        return new Phaser.Geom.Point(Math.floor((screenPosX - this.boardLeft) / CELL_SIZE), Math.floor((screenPosY - this.boardTop) / CELL_SIZE));
    }
    // Converts a grid location to a screen position
    toScreenPosition(gridPosX, gridPosY) {
        return new Phaser.Geom.Point(Math.floor(this.boardLeft + gridPosX * CELL_SIZE), Math.floor(this.boardTop + gridPosY * CELL_SIZE));
    }
}
var Pictures = {
    Heart: [
        [0, 1, 1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ]
};
var TileStates;
(function (TileStates) {
    TileStates[TileStates["Unrevealed"] = 0] = "Unrevealed";
    TileStates[TileStates["MarkedAsBlank"] = 1] = "MarkedAsBlank";
    TileStates[TileStates["Correct"] = 2] = "Correct";
    TileStates[TileStates["Mistake"] = 3] = "Mistake";
})(TileStates || (TileStates = {}));
var TileFrames;
(function (TileFrames) {
    TileFrames[TileFrames["Empty"] = 16] = "Empty";
    TileFrames[TileFrames["Correct"] = 17] = "Correct";
    TileFrames[TileFrames["Mistake"] = 18] = "Mistake";
    TileFrames[TileFrames["Cross"] = 19] = "Cross";
    TileFrames[TileFrames["MistakeCross"] = 20] = "MistakeCross";
    TileFrames[TileFrames["HintCross"] = 21] = "HintCross";
})(TileFrames || (TileFrames = {}));
class Tile {
    constructor(scene, worldPosition, isColored) {
        this.state = TileStates.Unrevealed;
        this.isColored = isColored;
        this.backSprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", TileFrames.Empty);
        this.backSprite.setOrigin(0, 0);
        this.frontSprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", TileFrames.Cross);
        this.frontSprite.setOrigin(0, 0);
        this.frontSprite.setVisible(false);
    }
    get isMarkedAsBlank() { return this.state == TileStates.MarkedAsBlank; }
    get isInteractive() { return this.state == TileStates.Unrevealed || this.state == TileStates.MarkedAsBlank; }
    markAsBlank() {
        if (!this.isMarkedAsBlank) {
            this.changeState(TileStates.MarkedAsBlank);
        }
        else {
            this.changeState(TileStates.Unrevealed);
        }
    }
    reveal() {
        // Can't reveal a tile if it is marked as an mistake
        if (this.isMarkedAsBlank) {
            return null;
        }
        if (this.isColored) {
            this.changeState(TileStates.Correct);
            return true;
        }
        this.changeState(TileStates.Mistake);
        return false;
    }
    changeState(newState) {
        let frame = 0;
        switch (newState) {
            default:
            case TileStates.Unrevealed:
                this.backSprite.setFrame(TileFrames.Empty);
            case TileStates.MarkedAsBlank:
                this.frontSprite.setFrame(TileFrames.Cross);
                this.frontSprite.setVisible(true);
                break;
            case TileStates.Correct:
                this.backSprite.setFrame(TileFrames.Correct);
                break;
            case TileStates.Mistake:
                this.backSprite.setFrame(TileFrames.Mistake);
                this.frontSprite.setFrame(TileFrames.MistakeCross);
                this.frontSprite.setVisible(true);
                break;
        }
        this.state = newState;
    }
}
//# sourceMappingURL=game.js.map
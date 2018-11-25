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
            if (this.input.activePointer.rightButtonDown()) {
                this.board.markTile(pointerGridPos);
                return;
            }
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
class EditorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EditorScene', active: true });
    }
    preload() {
        this.load.spritesheet('picross-main-sheet', 'assets/picross_sheet.png', { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE });
    }
    create() {
        this.saveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.board = new Board();
        this.board.createEmpty(this, 8, 8);
    }
    update() {
        this.updateInput();
    }
    updateInput() {
        if (this.input.activePointer.justDown) {
            // Get the grid location of the pointer
            let pointerGridPos = this.board.toGridPosition(this.input.activePointer.x, this.input.activePointer.y);
            // Swap the tile between blank and filled
            var tile = this.board.getTile(pointerGridPos.x, pointerGridPos.y);
            if (tile != null) {
                tile.isFilled = !tile.isFilled;
                tile.changeState(tile.isFilled ? TileStates.Correct : TileStates.Unrevealed);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.saveKey)) {
            let output = "Name: [\n";
            var array = this.board.createPictureArray();
            for (var y = 0; y < array.length; y++) {
                output += "\t[" + array[y].toString() + "],\n";
            }
            output += "],";
            console.log(output);
        }
    }
}
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
/// <reference path="scenes/gamescene.ts"/>
/// <reference path="scenes/editorscene.ts"/>
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
    /** Creates a board based on the picture array. The array should consist out of 1's and 0's (1 == filled, 0 == blank) */
    create(scene, picture) {
        // Determine the gridsize based on the picture
        this.gridSize = new Phaser.Geom.Point(picture[0].length, picture.length);
        this.tiles = Array();
        this.tilesToBeRevealed = 0;
        for (var y = 0; y < this.gridSize.y; y++) {
            // Add a new row
            this.tiles.push(new Array());
            for (var x = 0; x < this.gridSize.x; x++) {
                // Add a new Tile
                console.log("pos", x, y);
                this.tiles[y].push(new Tile(scene, this.toScreenPosition(x, y), !!picture[y][x]));
                // It adds 1 if the tile must be revealed and 0 if not
                this.tilesToBeRevealed += picture[y][x];
            }
        }
    }
    /** Creates an empty board with a specified size */
    createEmpty(scene, rowsAmount, columnsAmount) {
        // Create an empty 2d array of 0's
        var empty = Array();
        for (var y = 0; y < columnsAmount; y++) {
            empty.push(new Array());
            for (var x = 0; x < rowsAmount; x++) {
                empty[y].push(0);
            }
        }
        this.create(scene, empty);
    }
    /**
     * Reveal the tile as blank or filled.
     * @returns Whether the tile was filled or not. It indicates whether the player made a mistake by revealing this tile or not.
    */
    revealTile(gridpos) {
        let tile = this.getTile(gridpos.x, gridpos.y);
        // If the player clicked on a valid tile
        if (tile != null && tile.isInteractive) {
            // Reveal the tile and return whether it was correct or not
            if (tile.reveal()) {
                this.tilesToBeRevealed--;
                return true;
            }
            return false;
        }
        // If nothing was revealed, then there was no mistake
        return null;
    }
    /** This will mark the tile as blank. */
    markTile(gridpos) {
        let tile = this.getTile(gridpos.x, gridpos.y);
        if (tile != null) {
            tile.markAsBlank();
        }
    }
    /**
     * Get a tile at a specific grid location.
     * @returns The tile at the specified grid location. Returns null if the location was outside the grid.
    */
    getTile(x, y) {
        if (x < 0 || x >= this.gridSize.x || y < 0 || y >= this.gridSize.y) {
            return null;
        }
        return this.tiles[y][x];
    }
    /**
     * Converts a screen position to a location in the grid.
     * @returns The grid location of the specified screen position.
    */
    toGridPosition(screenPosX, screenPosY) {
        return new Phaser.Geom.Point(Math.floor((screenPosX - this.boardLeft) / CELL_SIZE), Math.floor((screenPosY - this.boardTop) / CELL_SIZE));
    }
    /**
     * Converts a grid location to a screen position.
     * @returns The screen position of the specified grid location.
    */
    toScreenPosition(gridPosX, gridPosY) {
        return new Phaser.Geom.Point(Math.floor(this.boardLeft + gridPosX * CELL_SIZE), Math.floor(this.boardTop + gridPosY * CELL_SIZE));
    }
    /**
     * Creates an array based on the current picture.
     * @returns An array that consists out of 1's and 0's forming the current picture.
    */
    createPictureArray() {
        var picture = new Array();
        for (var y = 0; y < this.gridSize.y; y++) {
            // Add a new row
            picture.push(new Array());
            // Adds a 0 or 1 depending on whether the corresponding tile is filled or not
            for (var x = 0; x < this.gridSize.x; x++) {
                picture[y].push(+this.tiles[y][x].isFilled);
            }
        }
        return picture;
    }
}
var Pictures = {
    Face: [
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0]
    ],
    Heart: [
        [0, 1, 1, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0]
    ],
    Pizza: [
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 0]
    ],
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
        this.isFilled = isColored;
        this.backSprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", TileFrames.Empty);
        this.backSprite.setOrigin(0, 0);
        this.frontSprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", TileFrames.Cross);
        this.frontSprite.setOrigin(0, 0);
        this.frontSprite.setVisible(false);
    }
    get isMarkedAsBlank() { return this.state == TileStates.MarkedAsBlank; }
    get isInteractive() { return this.state == TileStates.Unrevealed || this.state == TileStates.MarkedAsBlank; }
    markAsBlank() {
        if (!this.isInteractive) {
            return;
        }
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
        if (this.isFilled) {
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
                this.frontSprite.setVisible(false);
                break;
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
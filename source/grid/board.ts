
const CELL_SIZE: number = 32;

class Board
{
    gridSize: Phaser.Geom.Point;

    tiles: Array<Array<Tile>>;
    tilesToBeRevealed: number;

    rowHintNumbers: Array<Array<HintNumber>>;
    columnHintNumbers: Array<Array<HintNumber>>;

    get boardPixelWitdh(): number { return CELL_SIZE * this.gridSize.x; }
    get boardPixelHeight(): number { return CELL_SIZE * this.gridSize.y; }

    get boardLeft(): number { return SCREEN_WIDTH / 2 - this.boardPixelWitdh / 2; }
    get boardTop(): number { return SCREEN_HEIGHT / 2 - this.boardPixelHeight / 2; }

    get tilesAmount(): number { return this.gridSize.x * this.gridSize.y; }

    constructor()
    {
        
    }

    /** Creates a board based on the picture array. The array should consist out of 1's and 0's (1 == filled, 0 == blank) */
    create(scene: Phaser.Scene, picture: Array<Array<number>>)
    {
        // Determine the gridsize based on the picture
        this.gridSize = new Phaser.Geom.Point(picture[0].length, picture.length);

        this.tiles = Array<Array<Tile>>();
        this.tilesToBeRevealed = 0;

        for (var y = 0; y < this.gridSize.y; y++) {
            // Add a new row
            this.tiles.push(new Array<Tile>());
            
            for (var x = 0; x < this.gridSize.x; x++) {
                // Add a new Tile
                this.tiles[y].push(new Tile(scene, this.toScreenPosition(x, y), !!picture[y][x]));

                // It adds 1 if the tile must be revealed and 0 if not
                this.tilesToBeRevealed += picture[y][x];
            }
        }

        this.createRowHintNumbers(scene, picture);
        this.createColumnHintNumbers(scene, picture);
    }

    /** Creates an empty board with a specified size */
    createEmpty(scene: Phaser.Scene, rowsAmount: number, columnsAmount: number)
    {
        // Create an empty 2d array of 0's
        var empty = new Array<Array<number>>();
        for (var y = 0; y < columnsAmount; y++) {
            empty.push(new Array<number>());
            for (var x = 0; x < rowsAmount; x++) {
                empty[y].push(0);
            }
        }

        this.create(scene, empty);
    }

    createRowHintNumbers(scene: Phaser.Scene, picture: Array<Array<number>>)
    {
        this.rowHintNumbers = new Array<Array<HintNumber>>();

        for (var y = 0; y < this.gridSize.y; y++) {
            // Create a new row in the array
            this.rowHintNumbers.push(new Array<HintNumber>());
            
            let sequence = 0;
            for (var x = this.gridSize.x - 1; x >= 0; x--) {
                // Count how many filled tiles there are in a sequence
                if (!!picture[y][x]) {
                    sequence++;
                }

                // When there is a blank tile or if it's the last tile
                let seqeunceEnded = (!!!picture[y][x] || x == 0) && (sequence > 0);
                // When the row doesn't have any filled tiles
                let rowHasNoFilledTiles = sequence == 0 && x == 0 && this.rowHintNumbers[y].length == 0;

                if (seqeunceEnded || rowHasNoFilledTiles) {
                    // Store the seqeunce as a hint number
                    this.rowHintNumbers[y].push(new HintNumber(scene, this.toScreenPosition(-(this.rowHintNumbers[y].length + 1), y), sequence));

                    // Reset the seqeunce
                    sequence = 0;
                }
            }
        }
    }

    createColumnHintNumbers(scene: Phaser.Scene, picture: Array<Array<number>>)
    {
        this.columnHintNumbers = new Array<Array<HintNumber>>();

        for (var x = 0; x < this.gridSize.x; x++) {
            // Create a new row in the array
            this.columnHintNumbers.push(new Array<HintNumber>());
            
            let sequence = 0;
            for (var y = this.gridSize.y - 1; y >= 0; y--) {
                // Count how many filled tiles there are in a sequence
                if (!!picture[y][x]) {
                    sequence++;
                }

                // When there is a blank tile or if it's the last tile
                let seqeunceEnded = (!!!picture[y][x] || y == 0) && (sequence > 0);
                // When the row doesn't have any filled tiles
                let rowHasNoFilledTiles = sequence == 0 && y == 0 && this.columnHintNumbers[x].length == 0;
                
                if (seqeunceEnded || rowHasNoFilledTiles) {
                    // Store the seqeunce as a hint number
                    this.columnHintNumbers[x].push(new HintNumber(scene, this.toScreenPosition(x, -(this.columnHintNumbers[x].length + 1)), sequence));

                    // Reset the seqeunce
                    sequence = 0;
                }
            }
        }
    }

    /** 
     * Reveal the tile as blank or filled.
     * @returns Whether the tile was filled or not. It indicates whether the player made a mistake by revealing this tile or not.
    */
    revealTile(gridpos: Phaser.Geom.Point): boolean
    {
        let tile = this.getTile(gridpos.x, gridpos.y);
        
        // If the player clicked on a valid tile
        if (tile != null && tile.isInteractive) {
            // Reveal the tile
            let revealed = tile.reveal();

            // When succesfuly reveal, update the amount of tiles that needs to be revealed to win
            if (revealed === true) {
                this.tilesToBeRevealed--;
            }

            // Return whether the tile was succesfuly revealed or not
            return revealed;
        }

        // If nothing was revealed, then there was no mistake
        return null;
    }

    /** This will mark the tile as blank. */
    markTile(gridpos: Phaser.Geom.Point)
    {
        let tile = this.getTile(gridpos.x, gridpos.y);

        if (tile != null) {
            tile.markAsBlank();
        }
    }

    /** 
     * Get a tile at a specific grid location. 
     * @returns The tile at the specified grid location. Returns null if the location was outside the grid.
    */
    getTile(x: number, y: number): Tile
    {
        if (x < 0 || x >= this.gridSize.x || y < 0 || y >= this.gridSize.y) {
            return null;
        }
        return this.tiles[y][x];
    }

    /** 
     * Converts a screen position to a location in the grid.
     * @returns The grid location of the specified screen position.
    */
    toGridPosition(screenPosX: number, screenPosY: number): Phaser.Geom.Point
    {
        return new Phaser.Geom.Point(
            Math.floor((screenPosX - this.boardLeft) / CELL_SIZE),  
            Math.floor((screenPosY - this.boardTop) / CELL_SIZE),
        );                    
    }

    /** 
     * Converts a grid location to a screen position.
     * @returns The screen position of the specified grid location.
    */
    toScreenPosition(gridPosX: number, gridPosY: number): Phaser.Geom.Point
    {
        return new Phaser.Geom.Point(
            Math.floor(this.boardLeft + gridPosX * CELL_SIZE),  
            Math.floor(this.boardTop + gridPosY * CELL_SIZE),
        );
    }

    /** 
     * Creates an array based on the current picture.
     * @returns An array that consists out of 1's and 0's forming the current picture.
    */
    createPictureArray(): Array<Array<number>>
    {
        var picture = new Array<Array<number>>();

        for (var y = 0; y < this.gridSize.y; y++) {
            // Add a new row
            picture.push(new Array<number>());
            
            // Adds a 0 or 1 depending on whether the corresponding tile is filled or not
            for (var x = 0; x < this.gridSize.x; x++) {
                picture[y].push(+this.tiles[y][x].isFilled);
            }
        }

        return picture;
    }
}

const CELL_SIZE: number = 32;

class Board
{
    spriteGroup: Phaser.GameObjects.Group;

    gridSize: Phaser.Geom.Point;

    tiles: Array<Array<Tile>>;
    tilesToBeRevealed: number;

    get boardPixelWitdh(): number { return CELL_SIZE * this.gridSize.x; }
    get boardPixelHeight(): number { return CELL_SIZE * this.gridSize.y; }

    get boardLeft(): number { return SCREEN_WIDTH / 2 - this.boardPixelWitdh / 2; }
    get boardTop(): number { return SCREEN_HEIGHT / 2 - this.boardPixelHeight / 2; }

    get tilesAmount(): number { return this.gridSize.x * this.gridSize.y; }

    constructor()
    {
        
    }

    create(scene: Phaser.Scene, picture: Array<Array<number>>)
    {
        // Determine the gridsize based on the picture
        this.gridSize = new Phaser.Geom.Point(picture.length, picture[0].length);

        this.tiles = Array<Array<Tile>>();
        this.tilesToBeRevealed = 0;

        for (let y = 0; y < this.gridSize.y; y++) {
            // Add a new row
            this.tiles.push(new Array<Tile>());
            
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

    revealTile(gridpos: Phaser.Geom.Point): boolean
    {
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

    markTile(gridpos: Phaser.Geom.Point)
    {
        let tile = this.getTile(gridpos.x, gridpos.y);

        if (tile != null) {
            tile.markAsBlank();
        }
    }

    getTile(x: number, y: number): Tile
    {
        if (x < 0 || x >= this.gridSize.x || y < 0 || y >= this.gridSize.y) {
            return null;
        }
        return this.tiles[y][x];
    }

    // Converts a screen position to a location in the grid
    toGridPosition(screenPosX: number, screenPosY: number): Phaser.Geom.Point
    {
        return new Phaser.Geom.Point(
            Math.floor((screenPosX - this.boardLeft) / CELL_SIZE),  
            Math.floor((screenPosY - this.boardTop) / CELL_SIZE),
        );                    
    }

    // Converts a grid location to a screen position
    toScreenPosition(gridPosX: number, gridPosY: number): Phaser.Geom.Point
    {
        return new Phaser.Geom.Point(
            Math.floor(this.boardLeft + gridPosX * CELL_SIZE),  
            Math.floor(this.boardTop + gridPosY * CELL_SIZE),
        );
    }
}
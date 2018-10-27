
const CELL_SIZE: number = 32;

enum TileFrames
{
    Empty = 16,
    Marked = 17,
    Cross = 19,
}

class Board
{
    spriteGroup: Phaser.GameObjects.Group;

    gridSize: Phaser.Geom.Point;

    get boardPixelWitdh(): number { return CELL_SIZE * this.gridSize.x; }
    get boardPixelHeight(): number { return CELL_SIZE * this.gridSize.y; }

    get boardLeft(): number { return SCREEN_WIDTH / 2 - this.boardPixelWitdh / 2; }
    get boardTop(): number { return SCREEN_HEIGHT / 2 - this.boardPixelHeight / 2; }

    get tilesAmount(): number { return this.gridSize.x * this.gridSize.y; }

    constructor(rowLength: number, columnLength: number)
    {
        this.gridSize = new Phaser.Geom.Point(rowLength, columnLength);
    }

    createSprites(scene: Phaser.Scene)
    {
        var groupConfig: GroupCreateConfig = {
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
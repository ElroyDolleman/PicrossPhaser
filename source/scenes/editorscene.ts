class EditorScene extends Phaser.Scene
{
    board: Board;
    saveKey: Phaser.Input.Keyboard.Key;

    constructor()
    {
        super({ key: 'EditorScene', active: true});
    }

    preload()
    {
        this.load.spritesheet('picross-main-sheet', 'assets/picross_sheet.png', { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE });
    }

    create()
    {
        this.saveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.board = new Board();
        this.board.createEmpty(this, 8, 8);
    }

    update()
    {
        this.updateInput();
    }

    updateInput()
    {
        if (this.input.activePointer.justDown)
        {
            // Get the grid location of the pointer
            let pointerGridPos = this.board.toGridPosition(this.input.activePointer.x, this.input.activePointer.y);

            // Swap the tile between blank and filled
            var tile = this.board.getTile(pointerGridPos.x, pointerGridPos.y);
            if (tile != null) {
                tile.isFilled = !tile.isFilled;
                tile.changeState(tile.isFilled ? TileStates.Correct : TileStates.Unrevealed);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.saveKey))
        {
            let output: string = "Name: [\n";
            var array = this.board.createPictureArray();

            for (var y = 0; y < array.length; y++) {
                output += "\t[" + array[y].toString() + "],\n";
            }

            output += "],";
            console.log(output);
        }
    }
}
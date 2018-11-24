class GameScene extends Phaser.Scene
{
    board: Board;

    constructor()
    {
        super({ key: 'GameScene', active: true});
    }

    preload()
    {
        this.load.spritesheet('picross-main-sheet', 'assets/picross_sheet.png', { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE });
    }

    create()
    {
        this.board = new Board(8, 8);
        this.board.create(this);
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

    resize() 
    {
        var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
    
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
}
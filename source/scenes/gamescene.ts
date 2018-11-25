class GameScene extends Phaser.Scene
{
    board: Board;

    gameStats = {
        mistakes: 0,
        successfulReveals: 0
    }

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
        this.board = new Board();
        this.board.create(this, Pictures.SmashLogo);
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

            if (this.input.activePointer.rightButtonDown())
            {
                this.board.markTile(pointerGridPos);

                return;
            }

            // Reveal the tile and check if the player is correct
            let correct = this.board.revealTile(pointerGridPos);

            // When the tile is revealed and it was correct
            if (correct === true) {
                // Update the game stats
                this.gameStats.successfulReveals++;
                console.log("Correct", this.gameStats.successfulReveals);

                if (this.board.tilesToBeRevealed == 0) {
                    console.log("Win!");
                }
            }
            // When the tile is revealed but it was a mistake
            else if (correct === false) {
                // Update the amount of mistakes
                this.gameStats.mistakes++;
                console.log("Wrong", this.gameStats.mistakes);
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
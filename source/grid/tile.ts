enum TileStates
{
    Unrevealed,
    MarkedAsBlank,
    Revealed,
    Mistake
}

class Tile
{
    isColored: boolean;

    private state: TileStates = TileStates.Unrevealed;

    private backSprite: Phaser.GameObjects.Sprite;
    private frontSprite: Phaser.GameObjects.Sprite;

    public isMarkedAsBlank(): boolean { return this.state == TileStates.MarkedAsBlank; }
    public isInteractive(): boolean { return this.state == TileStates.Unrevealed || this.state == TileStates.MarkedAsBlank; }

    constructor(backSprite: Phaser.GameObjects.Sprite, isColored: boolean)
    {
        this.isColored = isColored;
        this.backSprite = backSprite;
    }

    markAsBlank()
    {
        if (!this.isMarkedAsBlank) {
            this.changeState(TileStates.MarkedAsBlank);
        }
        else {
            this.changeState(TileStates.Unrevealed);
        }
    }

    reveal()
    {
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

    changeState(newState: TileStates)
    {
        this.state = newState;
    }
}
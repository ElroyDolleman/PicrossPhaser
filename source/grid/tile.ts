enum TileStates
{
    Unrevealed,
    MarkedAsBlank,
    Correct,
    Mistake
}

enum TileFrames
{
    Empty = 16,
    Correct = 17,
    Mistake = 18,
    Cross = 19,
    MistakeCross = 20,
    HintCross = 21
}

class Tile
{
    isFilled: boolean;

    private state: TileStates = TileStates.Unrevealed;

    private backSprite: Phaser.GameObjects.TileSprite;
    private frontSprite: Phaser.GameObjects.TileSprite;

    public get isMarkedAsBlank(): boolean { return this.state == TileStates.MarkedAsBlank; }
    public get isInteractive(): boolean { return this.state == TileStates.Unrevealed || this.state == TileStates.MarkedAsBlank; }

    constructor(scene: Phaser.Scene, worldPosition: Phaser.Geom.Point, isColored: boolean)
    {
        this.isFilled = isColored;

        this.backSprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", TileFrames.Empty);
        this.backSprite.setOrigin(0, 0);

        this.frontSprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", TileFrames.Cross);
        this.frontSprite.setOrigin(0, 0);
        this.frontSprite.setVisible(false);
    }

    markAsBlank()
    {
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

    reveal(): boolean
    {
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

    changeState(newState: TileStates)
    {
        let frame = 0;
        switch(newState) {
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
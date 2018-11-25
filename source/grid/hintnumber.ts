class HintNumber 
{
    private sprite: Phaser.GameObjects.TileSprite;

    private found: boolean = false;
    hintValue: number;

    get tintColor(): number { return !this.found ? 0x0094FF : 0xC0C0C0; }

    constructor(scene: Phaser.Scene, worldPosition: Phaser.Geom.Point, hintValue: number)
    {
        this.hintValue = hintValue;

        // When the hint value is 0, it's found by default
        if (hintValue == 0) {
            this.found = true;
        }

        this.sprite = scene.add.tileSprite(worldPosition.x, worldPosition.y, CELL_SIZE, CELL_SIZE, "picross-main-sheet", hintValue);
        this.sprite.tint = this.tintColor;
        this.sprite.setOrigin(0, 0);
    }
}
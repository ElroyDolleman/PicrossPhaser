const SCREEN_WIDTH: number = 800;
const SCREEN_HEIGHT: number = 600;

class GameScene extends Phaser.Scene
{
    
}

var config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#e9f4fc',
    parent: 'picross',
    disableContextMenu: true,
    scene: [ GameScene ]
};

var game = new Phaser.Game(config);
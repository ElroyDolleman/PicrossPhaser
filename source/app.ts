const SCREEN_WIDTH: number = 800;
const SCREEN_HEIGHT: number = 600;

class GameScene extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'GameScene', active: true});
    }

    preload()
    {
        
    }

    create()
    {

    }

    update()
    {

    }

    resize() 
    {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
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
/// <reference path="scenes/gamescene.ts"/>
/// <reference path="settings.ts"/>

var config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#e9f4fc',
    parent: 'picross',
    title: "Picross",
    version: "1.0.0",
    disableContextMenu: true,
    scene: [ GameScene ]
};

var game = new Phaser.Game(config);
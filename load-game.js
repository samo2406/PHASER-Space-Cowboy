import Button from './button.js';

class startScene extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('phaser_logo', 'assets/sprites/phaser3-logo.png');
    }

    create ()
    {
        this.add.image(512, 384, 'sky');
        this.add.image(400, 100, 'phaser_logo');
        const button = new Button(0, 0, 'Start Game', this, () => console.log('game is started'));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,

    scene: startScene
};

const game = new Phaser.Game(config);
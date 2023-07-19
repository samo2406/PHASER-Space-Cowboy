export class startScene extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    }

    create ()
    {
        this.add.image(512, 384, 'sky');

        const logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        particles.startFollow(logo);
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,

    scene: startScene
};

const game = new Phaser.Game(config);
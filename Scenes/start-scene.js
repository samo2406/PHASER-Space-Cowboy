export class startScene extends Phaser.Scene {
  pressedStart = false

  constructor () {
    super({ key: 'Menu' })
  }

  preload () {
    this.load.image('start_button', './Assets/start_button.png')
    this.load.image('start_button_mouseover', './Assets/start_button_mouseover.png')
    this.load.image('space_cowboy', './Assets/game_name.png')
    this.load.spritesheet('menu_background', './Assets/background.png', { frameWidth: 1024, frameHeight: 768 })
    this.load.image('phaser_logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png')
  }

  create () {
    this.anims.create({
      key: 'menu_background',
      frames: this.anims.generateFrameNumbers('menu_background', {
        start: 0,
        end: 58
      }),
      frameRate: 10,
      repeat: -1
    })

    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'menu_background')
    this.background.anims.play('menu_background', true)

    this.add.sprite(this.cameras.main.centerX, 100, 'phaser_logo')
    this.add.sprite(this.cameras.main.centerX, 400, 'space_cowboy')
    const button = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'start_button').setInteractive()

    button.on('pointerdown', async function () {
      button.input.enabled = false
      this.cameras.main.fadeOut(500, 0, 0, 0)

      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        console.log('switching to level1')
        this.pressedStart = true
        this.scene.start('Level1')
      })
    }, this)

    button.on('pointerover', function () {
      button.setTexture('start_button_mouseover')
    })

    button.on('pointerout', function () {
      button.setTexture('start_button')
    })
  }
}

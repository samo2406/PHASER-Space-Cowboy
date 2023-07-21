import { Player } from '../player.js'

export class levelScene extends Phaser.Scene {
  constructor () {
    super({ key: 'Level1' })
  }

  preload () {
    this.load.image('background', './Assets/level1_bg.png')
    this.load.image('platform0', './Assets/platform_0.png')
    this.load.image('platform1', './Assets/platform_1.png')
    this.load.image('platform2', './Assets/platform_2.png')
    this.load.image('platform3', './Assets/platform_3.png')
    this.load.image('platform4', './Assets/platform_4.png')
    this.load.image('platform5', './Assets/platform_5.png')
    this.load.image('platform6', './Assets/platform_6.png')
    this.load.spritesheet('player', './Assets/player.png', { frameWidth: 60, frameHeight: 84, spacing: 6 })
    this.load.image('star_particle', './Assets/star_particle.png')
  }

  create () {
    // Background
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0)

    // World bounds
    this.physics.world.setBounds(0, 0, this.background.width, this.background.height)

    // Platforms
    this.buildPlatforms()

    // Player
    this.player = new Player(this, 400, 2100, 'player', this.platforms)

    // Player controlls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    // Particle emitter
    this.particles = this.add.particles('star_particle')
    this.emitter = this.particles.createEmitter({
      lifespan: 250,
      speed: { min: 100, max: 125 },
      count: { min: 3, max: 5 },
      scale: { start: 1.5, end: 0 },
      rotate: { start: 0, end: 20 },
      alpha: { start: 1, end: 0 },
      gravityY: 0,
      on: false
    })
    this.cameras.main.fadeIn(1000, 0, 0, 0)
  }

  update () {
    if (this.keyA.isDown || this.cursors.left.isDown) {
      this.player.moveLeft()
    } else if (this.keyD.isDown || this.cursors.right.isDown) {
      this.player.moveRight()
    } else {
      this.player.stand()
    }

    if ((this.keyW.isDown || this.keySpace.isDown || this.cursors.up.isDown) && this.player.player.body.touching.down) {
      this.player.jump()
      this.emitter.emitParticleAt(this.player.player.body.x + this.player.player.displayWidth / 2, this.player.player.body.y + this.player.player.displayHeight, 2)
    } else if (this.keyS.isDown || this.cursors.down.isDown) {
      this.player.sit = true
    } else {
      this.player.sit = false
    }

    const playerScrollCenterY = this.player.player.body.y + (this.player.player.body.height / 2) - (this.cameras.main.displayHeight / 2)
    const distanceFromCamera = Math.abs(this.cameras.main.scrollY - playerScrollCenterY)
    if (this.cameras.main.scrollY < playerScrollCenterY) {
      this.cameras.main.scrollY = Math.min(this.cameras.main.scrollY + distanceFromCamera * 0.01, this.background.displayHeight - this.cameras.main.displayHeight / 2)
    } else if (this.cameras.main.scrollY > playerScrollCenterY) {
      this.cameras.main.scrollY = Math.max(this.cameras.main.scrollY - distanceFromCamera * 0.01, this.cameras.main.displayHeight / 2)
    }

    this.player.update()
  }

  buildPlatforms () {
    this.platforms = this.physics.add.staticGroup()

    this.platforms.create(this.background.displayWidth / 2, this.background.displayHeight, 'platform0')

    this.platforms.create(420, 2100, 'platform2')
    this.platforms.create(700, 2200, 'platform1')
    this.platforms.create(150, 1950, 'platform3')
    this.platforms.create(400, 1750, 'platform1')
    this.platforms.create(800, 1750, 'platform1')
    this.platforms.create(1000, 1550, 'platform1')
    this.platforms.create(800, 1350, 'platform1')
    this.platforms.create(350, 1300, 'platform2')
  }
}

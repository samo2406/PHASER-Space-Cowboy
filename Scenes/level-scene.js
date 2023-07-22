import { Player } from '../GameObjects/player.js'
import { Enemy } from '../GameObjects/enemy.js'
import { CameraController } from '../GameObjects/camera.js'

export class levelScene extends Phaser.Scene {
  constructor () {
    super({ key: 'Level1' })
  }

  preload () {
    this.load.image('start_button', './Assets/start_button.png')
    this.load.image('start_button_mouseover', './Assets/start_button_mouseover.png')
    this.load.image('space_cowboy', './Assets/game_name.png')
    this.load.image('phaser_logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png')

    this.load.image('background', './Assets/level1_bg.png')
    this.load.image('bg_planets', './Assets/planets.png')
    this.load.image('platform0', './Assets/platform_0.png')
    this.load.image('platform1', './Assets/platform_1.png')
    this.load.image('platform2', './Assets/platform_2.png')
    this.load.image('platform3', './Assets/platform_3.png')
    this.load.image('platform4', './Assets/platform_4.png')
    this.load.image('platform5', './Assets/platform_5.png')
    this.load.image('platform6', './Assets/platform_6.png')
    this.load.spritesheet('player', './Assets/player.png', { frameWidth: 60, frameHeight: 84, spacing: 6 })
    this.load.image('star_particle', './Assets/star_particle.png')
    this.load.image('jump_particle', './Assets/jump_particle.png')
    this.load.spritesheet('red_enemy', './Assets/red_enemy.png', { frameWidth: 123, frameHeight: 98, spacing: 4 })
    this.load.spritesheet('green_enemy', './Assets/green_enemy.png', { frameWidth: 126, frameHeight: 81, spacing: 7 })
    this.load.spritesheet('blue_enemy', './Assets/blue_enemy.png', { frameWidth: 129, frameHeight: 98, spacing: 1 })
    this.load.spritesheet('orange_enemy', './Assets/orange_enemy.png', { frameWidth: 115, frameHeight: 81, spacing: 2 })
  }

  create () {
    // Background
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0)

    // Camera controller
    this.cameras.main.scrollY = -700
    this.cameraController = new CameraController(this)

    // Falling star emitter ( Left / Right )
    this.starParticles = this.add.particles('star_particle')
    this.starEmitterL = this.starParticles.createEmitter({
      lifespan: 15000,
      angle: { min: 0, max: 15 },
      speed: { min: 75, max: 100 },
      count: 1,
      scale: { start: 0.5, end: 0.3 },
      rotate: { start: 0, end: 25 },
      alpha: { start: 0.75, end: 0.50 },
      tint: 0xe3e3ac,
      gravityY: 0,
      on: false
    })

    this.starEmitterR = this.starParticles.createEmitter({
      lifespan: 15000,
      angle: { min: 165, max: 180 },
      speed: { min: 75, max: 100 },
      count: 1,
      scale: { start: 0.5, end: 0.3 },
      rotate: { start: 0, end: 25 },
      alpha: { start: 0.75, end: 0.50 },
      tint: 0xe3e3ac,
      gravityY: 0,
      on: false
    })

    // Background planets
    this.bg_planets = this.add.image(0, 0, 'bg_planets').setOrigin(0, 0)

    // World bounds
    this.physics.world.setBounds(0, -500, this.background.width, this.background.height + 1000)

    // Menu logos
    this.add.sprite(this.cameras.main.centerX, -600, 'phaser_logo')
    this.add.sprite(this.cameras.main.centerX, -270, 'space_cowboy')

    // Platforms
    this.buildPlatforms()

    // Enemies
    this.spawnEnemies()

    // Player
    this.player = new Player(this, 900, -250, 'player', this.platforms)

    // Player controlls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    // Start button
    this.button = this.add.sprite(495, -299, 'start_button').setInteractive()
    this.button.setScale(0.55, 0.55)
    this.button.on('pointerdown', async function () {
      this.button.input.enabled = false
      this.player.canMove = false
      this.player.removeColliders()
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.button.input.enabled = true
        },
        callbackScope: this
      })
    }, this)

    this.button.on('pointerover', function () {
      this.button.setTexture('start_button_mouseover')
      this.button.setPosition(496, -304)
    }, this)

    this.button.on('pointerout', function () {
      this.button.setTexture('start_button')
      this.button.setPosition(495, -299)
    }, this)

    // Jump particle emitter
    this.jumpParticles = this.add.particles('jump_particle')
    this.jumpEmitter = this.jumpParticles.createEmitter({
      lifespan: 250,
      speed: { min: 100, max: 125 },
      count: { min: 3, max: 5 },
      scale: { start: 1.5, end: 0 },
      rotate: { start: 0, end: 20 },
      alpha: { start: 1, end: 0 },
      gravityY: 0,
      on: false
    })

    this.cameras.main.fadeIn(500, 0, 0, 0)
    this.randomStar()
  }

  update () {
    if (this.keyA.isDown || this.cursors.left.isDown) {
      this.player.moveLeft()
    } else if (this.keyD.isDown || this.cursors.right.isDown) {
      this.player.moveRight()
    } else {
      this.player.stand()
    }

    if (this.keyW.isDown || this.keySpace.isDown || this.cursors.up.isDown) {
      this.player.jump(this.jumpEmitter)
    } else if (this.keyS.isDown || this.cursors.down.isDown) {
      this.player.sit = true
    } else {
      this.player.sit = false
    }

    this.cameraController.update()
    this.player.update()
    this.enemies.forEach(enemy => enemy.update())
  }

  buildPlatforms () {
    this.platforms = this.physics.add.staticGroup()

    this.platforms.create(this.background.displayWidth / 2, this.physics.world.bounds.height - 500, 'platform0')

    this.platforms.create(420, 2600, 'platform2')
    this.platforms.create(700, 2700, 'platform1')
    this.platforms.create(150, 2450, 'platform3')
    this.platforms.create(400, 2250, 'platform1')
    this.platforms.create(800, 2250, 'platform1')
    this.platforms.create(1000, 2075, 'platform3')
    this.platforms.create(800, 1875, 'platform1')
    this.platforms.create(400, 1835, 'platform2')
    this.platforms.create(25, 1650, 'platform4')
    this.platforms.create(195, 1435, 'platform1')
    this.platforms.create(450, 1315, 'platform2')
    this.platforms.create(925, 1200, 'platform3')
    this.platforms.create(400, 1115, 'platform2')
    this.platforms.create(970, 995, 'platform1')
    this.platforms.create(845, 830, 'platform1')
    this.platforms.create(475, 680, 'platform4')
    this.platforms.create(300, 550, 'platform2')
    this.platforms.create(100, 400, 'platform2')
    this.platforms.create(350, 250, 'platform2')
    this.platforms.create(500, 100, 'platform2')
    this.platforms.create(600, -50, 'platform2')
    this.platforms.create(900, -150, 'platform4')
  }

  spawnEnemies () {
    this.enemies = []

    this.enemies.push(new Enemy(this, 800, 1700, 'red_enemy', 500, 1000, true))
    this.enemies.push(new Enemy(this, 50, 2200, 'green_enemy', 150, 1600, false))
    this.enemies.push(new Enemy(this, 330, 950, 'orange_enemy', 250, 1000, false))
    // this.enemies.push(new Enemy(this, 260, 1700, 'blue_enemy', 420, 2400, 100))
  }

  // Fires a star particle from a random side, in a random time and call the function again
  randomStar () {
    const randomTime = Math.random() * 8000
    const randomSide = Math.random()
    if (randomSide < 0.5) {
      this.time.addEvent({
        delay: randomTime,
        callback: () => {
          this.starEmitterR.emitParticleAt(1024, this.player.player.body.y - Math.random() * 600, 1)
          this.randomStar()
        },
        callbackScope: this
      })
    } else {
      this.time.addEvent({
        delay: randomTime,
        callback: () => {
          this.starEmitterL.emitParticleAt(0, this.player.player.body.y - Math.random() * 600, 1)
          this.randomStar()
        },
        callbackScope: this
      })
    }
  }
}

import Player from '../GameObjects/player.js'
import { spawnEnemies, spawnPlatforms } from '../Scenes/level-objects.js'
import { CameraController } from '../GameObjects/camera.js'

export class levelScene extends Phaser.Scene {
  constructor () {
    super({ key: 'Level1' })
    this.timer = 0
  }

  preload () {
    this.load.image('start_button', './Assets/start_button.png')
    this.load.image('start_button_mouseover', './Assets/start_button_mouseover.png')
    this.load.image('space_cowboy', './Assets/game_name.png')
    this.load.image('phaser_logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png')
    this.load.image('timer_sign_static', './Assets/timer_sign_static.png')

    this.load.image('background', './Assets/level1_bg.png')
    this.load.image('bg_planets', './Assets/planets.png')
    this.load.image('platform0', './Assets/platform_0.png')
    this.load.image('platform1', './Assets/platform_1.png')
    this.load.image('platform2', './Assets/platform_2.png')
    this.load.image('platform3', './Assets/platform_3.png')
    this.load.image('platform4', './Assets/platform_4.png')
    this.load.image('platform5', './Assets/platform_5.png')
    this.load.image('platform6', './Assets/platform_6.png')

    this.load.image('star_particle', './Assets/star_particle.png')
    this.load.image('jump_particle', './Assets/jump_particle.png')

    this.load.spritesheet('player', './Assets/player.png', { frameWidth: 60, frameHeight: 84, spacing: 6 })
    this.load.spritesheet('red_enemy', './Assets/red_enemy.png', { frameWidth: 123, frameHeight: 98, spacing: 4 })
    this.load.spritesheet('green_enemy', './Assets/green_enemy.png', { frameWidth: 126, frameHeight: 81, spacing: 7 })
    this.load.spritesheet('blue_enemy', './Assets/blue_enemy.png', { frameWidth: 124, frameHeight: 98, spacing: 11 })
    this.load.spritesheet('orange_enemy', './Assets/orange_enemy.png', { frameWidth: 115, frameHeight: 81, spacing: 2 })

    this.load.audio('jump', './Assets/jump.wav')
    this.load.audio('hit', './Assets/hit.wav')
    this.load.audio('finish', './Assets/finish.wav')
  }

  create () {
    // UI Scene
    this.UI = this.scene.get('UIScene')

    // Background
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0)

    // Sounds
    this.jumpSound = this.sound.add('jump', { loop: false, volume: 0.1 })
    this.hitSound = this.sound.add('hit', { loop: false, volume: 0.1 })
    this.finishSound = this.sound.add('finish', { loop: false, volume: 0.1 })

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

    // Platforms
    spawnPlatforms(this)

    // Enemies
    spawnEnemies(this)

    // Player
    this.player = new Player(this, 900, -250, 'player')

    // Player controlls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    // Jump particle emitter
    this.jumpParticles = this.add.particles('jump_particle')
    this.jumpEmitter = this.jumpParticles.createEmitter({
      lifespan: 250,
      angle: { min: 15, max: 165 },
      speed: { min: 100, max: 125 },
      count: { min: 3, max: 4 },
      scale: { start: 1.5, end: 0 },
      rotate: { start: 0, end: 20 },
      alpha: { start: 1, end: 0 },
      gravityY: 200,
      on: false
    })

    // Fireworks particle emitter
    this.jumpParticles = this.add.particles('jump_particle')
    this.fireworkEmitter = this.jumpParticles.createEmitter({
      lifespan: 3000,
      angle: { min: 240, max: 300 },
      speed: { min: 500, max: 700 },
      count: { min: 50, max: 60 },
      scale: { start: 1, end: 1.5 },
      rotate: { start: 0, end: 1600 },
      alpha: { start: 1, end: 0 },
      tint: { min: 0x000000, max: 0xffffff },
      gravityY: 1000,
      on: false
    })

    this.cameras.main.fadeIn(500, 0, 0, 0)
    this.randomStar()

    // Menu logos
    this.add.sprite(this.cameras.main.centerX, -600, 'phaser_logo')
    this.add.sprite(this.cameras.main.centerX, -270, 'space_cowboy')

    // Start button
    this.button = this.add.sprite(495, -299, 'start_button').setInteractive()
    this.button.setScale(0.55, 0.55)
    this.button.on('pointerdown', async function () {
      this.button.input.enabled = false
      this.player.canMove = false
      this.player.pauseColliders()
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.signCopy) {
            this.signCopy.destroy()
            this.timerCopy.destroy()
          }
          this.UI.sign.play('sign_falling')
          this.UI.sign.setVisible(true)
          this.UI.tweens.add({
            targets: this.UI.timerDisplay,
            duration: 800,
            delay: 500,
            alpha: { from: 0, to: 1 }
          })
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
  }

  // Fires a star particle from a random side, in a random time and call the function again
  randomStar () {
    const randomTime = Math.random() * 8000
    const randomSide = Math.random()
    if (randomSide < 0.5) {
      this.time.addEvent({
        delay: randomTime,
        callback: () => {
          this.starEmitterR.emitParticleAt(1024, this.player.body.y - Math.random() * 600, 1)
          this.randomStar()
        },
        callbackScope: this
      })
    } else {
      this.time.addEvent({
        delay: randomTime,
        callback: () => {
          this.starEmitterL.emitParticleAt(0, this.player.body.y - Math.random() * 600, 1)
          this.randomStar()
        },
        callbackScope: this
      })
    }
  }

  startTimer () {
    this.startTime = new Date().getTime()
    this.levelTimer = this.time.addEvent({ delay: 150, loop: true, callback: this.updateTimer, callbackScope: this })
  }

  updateTimer () {
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - this.startTime
    this.UI.setTimer(timeDifference)
  }

  finishedLevel () {
    const endTime = new Date().getTime()
    const finalTime = endTime - this.startTime
    this.UI.setTimer(finalTime)
    this.levelTimer.paused = true

    this.button.input.enabled = true
    this.fireworkEmitter.emitParticleAt(this.player.body.x + this.player.displayWidth / 2, this.player.body.y + this.player.displayHeight, 50)

    // Creates a copy of UI sign
    this.signCopy = this.add.sprite(920, -650, 'timer_sign_static')
    this.timerCopy = this.add.text(860, -643, this.UI.timerDisplay.text, { fontFamily: 'retro', fontSize: '21px', fill: '#b3b3b3' })
    this.UI.timerDisplay.setAlpha(0)
    this.UI.setTimer(0)
    this.UI.sign.setVisible(false)
  }
}

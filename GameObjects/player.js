export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x = 0, y = 0, texture = 'player') {
    super(scene, x, y, texture)
    scene.events.on('update', this.update, this)

    scene.physics.add.existing(this)
    scene.sys.displayList.add(this)
    scene.sys.updateList.add(this)

    this.maxSpeedGround = 450
    this.maxSpeedAir = 600
    this.jumpPower = 2500
    this.jumpTick = 0
    this.scene = scene
    this.sit = false
    this.canJump = false
    this.canMove = false
    this.ridingPlatform = false
    this.holdingMovement = false
    this.firstInput = false

    this.setSize(60, 60, true)
    this.setOffset(0, 20)
    this.setFlipX(true)

    this.setCollideWorldBounds(true)
    this.scene.physics.add.collider(this, scene.platforms, this.hitPlatform, null, this)
    this.scene.physics.add.overlap(this, scene.enemies, this.hitEnemy, null, this)
    this.scene.physics.add.overlap(this, scene.finishZone, this.finishLevel, null, this)

    // Animations
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'stand',
      frames: [{ key: texture, frame: 5 }],
      repeat: -1
    })

    this.scene.anims.create({
      key: 'jump',
      frames: [{ key: texture, frame: 4 }],
      repeat: -1
    })

    this.scene.anims.create({
      key: 'sit',
      frames: [{ key: texture, frame: 6 }],
      repeat: -1
    })
  }

  resumeColliders () {
    this.body.checkCollision.none = false
  }

  pauseColliders () {
    this.body.checkCollision.none = true
  }

  moveLeft () {
    this.holdingMovement = true
    if (this.canMove) {
      if (this.body.velocity.x > -50) {
        this.setVelocityX(-50)
      } else if (this.ridingPlatform) {
        this.setVelocityX(-300)
      }
      if (this.body.touching.down) {
        this.setVelocityX(Math.max(this.body.velocity.x - 10, -this.maxSpeedGround))
      } else {
        this.setVelocityX(Math.max(this.body.velocity.x - 10, -this.maxSpeedAir))
      }
    }
  }

  moveRight () {
    this.holdingMovement = true
    if (this.canMove) {
      if (this.body.velocity.x < 50) {
        this.setVelocityX(50)
      } else if (this.ridingPlatform) {
        this.setVelocityX(300)
      }
      if (this.body.touching.down) {
        this.setVelocityX(Math.min(this.body.velocity.x + 10, this.maxSpeedGround))
      } else {
        this.setVelocityX(Math.min(this.body.velocity.x + 10, this.maxSpeedAir))
      }
    }
  }

  stand () {
    this.holdingMovement = false
    if (this.canMove && !this.ridingPlatform) {
      if (Math.abs(this.body.velocity.x) > 0.1) {
        this.setVelocityX(this.body.velocity.x * 0.75)
      } else {
        this.setVelocityX(0)
      }
    }
  }

  jump (emitter) {
    if (this.body.touching.down && this.canMove) {
      this.canJump = false
      if (this.scene.UI.soundOn) {
        this.scene.jumpSound.play()
      }
      emitter.emitParticleAt(this.body.x + this.displayWidth / 2, this.body.y + this.displayHeight / 2, 4)
      this.setVelocityY(-(this.jumpPower))
      this.jumping = true
    }
  }

  hitEnemy () {
    if (this.canMove) {
      if (this.scene.UI.soundOn) {
        this.scene.hitSound.play()
      }
      const playerVelocity = this.body.velocity.clone()
      if (playerVelocity.y > 0) {
        playerVelocity.y = -1000
      } else {
        playerVelocity.y = -500
      }
      if (playerVelocity.x > 0) {
        playerVelocity.x = -500
      } else {
        playerVelocity.x = 500
      }
      this.canMove = false
      this.body.setVelocity(playerVelocity.x, playerVelocity.y)
      this.scene.time.addEvent({ delay: 250, callback: () => { this.canMove = true }, callbackScope: this })
      this.setTint(0xff0000)
      this.scene.time.addEvent({ delay: 250, callback: () => { this.setTint(0xffffff) }, callbackScope: this })
    }
  }

  hitPlatform (player, platform) {
    if (this.body.touching.down && (platform.targetX && platform.targetY)) {
      this.ridingPlatform = true
      this.body.setVelocityX(platform.body.velocity.x)
      this.body.setVelocityY(platform.body.velocity.y)
    }
  }

  finishLevel () {
    if (this.body.touching.down && this.canMove) {
      this.endTime = new Date().getTime()
      const finalTime = this.endTime - this.scene.startTime
      this.scene.UI.setTimer(finalTime)
      this.scene.levelTimer.destroy()
      if (this.scene.UI.soundOn) {
        this.scene.finishSound.play()
      }
      this.setVelocityX(0)
      this.canMove = false
      this.firstInput = false
      this.scene.button.input.enabled = true
      this.scene.fireworkEmitter.emitParticleAt(this.body.x + this.displayWidth / 2, this.body.y + this.displayHeight, 50)
    }
  }

  update () {
    if (!this.firstInput && (this.holdingMovement || this.jumping)) {
      this.scene.startTimer()
      this.firstInput = true
    }
    if (!this.body.touching.down) {
      this.ridingPlatform = false
    }
    if (this.y > 2500 && !this.canMove) {
      this.resumeColliders()
      this.canMove = true
    }

    if (this.jumping) {
      this.jumpTick++
      if (this.jumpTick >= 12) {
        this.jumpTick = 0
        this.setVelocityY(this.body.velocity.y * 0.65)
        if (this.body.velocity.y > -1) {
          this.jumping = false
        }
      }
    }

    if (this.body.velocity.x > 0) {
      this.setFlipX(false)
    } else if (this.body.velocity.x < 0) {
      this.setFlipX(true)
    }

    if (this.body.touching.down) {
      if (this.body.velocity.x !== 0 && this.holdingMovement) {
        this.anims.play('walk', true)
      } else if (this.sit) {
        this.anims.play('sit', true)
      } else {
        this.anims.play('stand', true)
      }
    } else {
      this.anims.play('jump', true)
    }
  }
}

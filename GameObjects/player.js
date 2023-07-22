export class Player {
  constructor (scene, x, y, texture) {
    this.maxSpeedGround = 450
    this.maxSpeedAir = 600
    this.jumpPower = 2500
    this.jumpTick = 0
    this.scene = scene
    this.sit = false
    this.canJump = false
    this.canMove = false
    this.player = scene.physics.add.sprite(x, y, texture)
    this.player.setSize(60, 78)
    this.player.setFlipX(true)

    this.player.setCollideWorldBounds(true)
    this.platformCollider = ''
    this.enemyColliders = []
    this.addColliders()

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

  addColliders () {
    this.platformCollider = this.scene.physics.add.collider(this.player, this.scene.platforms, this.hitPlatform, null, this)
    this.scene.enemies.forEach(enemy => this.enemyColliders.push(this.scene.physics.add.overlap(this.player, enemy.enemy, this.hitEnemy, null, this)))
  }

  removeColliders () {
    this.platformCollider.destroy()
    this.enemyColliders.forEach(enemyCol => enemyCol.destroy())
  }

  moveLeft () {
    if (this.canMove) {
      if (this.player.body.velocity.x > -20) {
        this.player.setVelocityX(-20)
      }
      if (this.player.body.touching.down) {
        this.player.setVelocityX(Math.max(this.player.body.velocity.x - 5, -this.maxSpeedGround))
      } else {
        this.player.setVelocityX(Math.max(this.player.body.velocity.x - 5, -this.maxSpeedAir))
      }
    }
  }

  moveRight () {
    if (this.canMove) {
      if (this.player.body.velocity.x < 20) {
        this.player.setVelocityX(20)
      }
      if (this.player.body.touching.down) {
        this.player.setVelocityX(Math.min(this.player.body.velocity.x + 5, this.maxSpeedGround))
      } else {
        this.player.setVelocityX(Math.min(this.player.body.velocity.x + 5, this.maxSpeedAir))
      }
    }
  }

  stand () {
    if (this.canMove) {
      while (Math.abs(this.player.body.velocity.x) > 0.1) {
        this.player.setVelocityX(this.player.body.velocity.x * 0.99)
      }
      this.player.setVelocityX(0)
    }
  }

  jump (emitter) {
    if (this.canJump && this.canMove) {
      this.canJump = false
      emitter.emitParticleAt(this.player.body.x + this.player.displayWidth / 2, this.player.body.y + this.player.displayHeight, 4)
      this.player.setVelocityY(-(this.jumpPower))
      this.jumping = true
    }
  }

  hitEnemy () {
    if (this.canMove) {
      const playerVelocity = this.player.body.velocity.clone()
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
      this.player.body.setVelocity(playerVelocity.x, playerVelocity.y)
      this.scene.time.addEvent({ delay: 250, callback: () => { this.canMove = true }, callbackScope: this })
      this.player.setTint(0xff0000)
      this.scene.time.addEvent({ delay: 250, callback: () => { this.player.setTint(0xffffff) }, callbackScope: this })
    }
  }

  hitPlatform () {
    if (this.player.body.touching.down) {
      this.canJump = true
    }
  }

  update () {
    if (this.player.body.y > 2500) {
      this.addColliders()
      this.canMove = true
    }

    if (this.jumping) {
      this.jumpTick++
      if (this.jumpTick >= 12) {
        this.jumpTick = 0
        this.player.setVelocityY(this.player.body.velocity.y * 0.65)
        if (this.player.body.velocity.y > -1) {
          this.jumping = false
        }
      }
    }

    if (this.player.body.velocity.x > 0) {
      this.player.setFlipX(false)
    } else if (this.player.body.velocity.x < 0) {
      this.player.setFlipX(true)
    }

    if (this.player.body.touching.down) {
      if (this.player.body.velocity.x !== 0) {
        this.player.anims.play('walk', true)
      } else if (this.sit) {
        this.player.anims.play('sit', true)
      } else {
        this.player.anims.play('stand', true)
      }
    } else {
      this.player.anims.play('jump', true)
    }
  }
}

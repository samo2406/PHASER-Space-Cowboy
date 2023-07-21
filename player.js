export class Player {
  constructor (scene, x, y, texture, platforms) {
    this.maxSpeedGround = 450
    this.maxSpeedAir = 600
    this.jumpPower = 2500
    this.jumpTick = 0
    this.scene = scene
    this.sit = false
    this.player = scene.physics.add.sprite(x, y, texture)
    this.player.setSize(60, 78)
    scene.physics.add.collider(this.player, platforms)
    this.player.setCollideWorldBounds(true)

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

  moveLeft () {
    if (this.player.body.velocity.x > -20) {
      this.player.setVelocityX(-20)
    }
    if (this.player.body.touching.down) {
      this.player.setVelocityX(Math.max(this.player.body.velocity.x - 5, -this.maxSpeedGround))
    } else {
      this.player.setVelocityX(Math.max(this.player.body.velocity.x - 5, -this.maxSpeedAir))
    }
  }

  moveRight () {
    if (this.player.body.velocity.x < 20) {
      this.player.setVelocityX(20)
    }
    if (this.player.body.touching.down) {
      this.player.setVelocityX(Math.min(this.player.body.velocity.x + 5, this.maxSpeedGround))
    } else {
      this.player.setVelocityX(Math.min(this.player.body.velocity.x + 5, this.maxSpeedAir))
    }
  }

  stand () {
    while (Math.abs(this.player.body.velocity.x) > 0.1) {
      this.player.setVelocityX(this.player.body.velocity.x * 0.99)
    }
    this.player.setVelocityX(0)
  }

  jump () {
    this.player.setVelocityY(-(this.jumpPower))
    this.jumping = true
  }

  update () {
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

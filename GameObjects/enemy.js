export class Enemy {
  constructor (scene, x, y, texture, velocity, duration, vertical) {
    this.velocity = velocity
    this.scene = scene
    this.originX = x
    this.originY = y
    this.duration = duration
    this.vertical = vertical
    this.enemy = scene.physics.add.sprite(x, y, texture).setScale(0.6, 0.6)
    this.enemy.setSize(70, 64)
    this.enemy.body.setAllowGravity(false)

    // Animations
    this.scene.anims.create({
      key: 'default' + texture,
      frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1
    })

    this.scene.tweens.timeline({
      targets: this.enemy.body.velocity,
      loop: -1,
      tweens: (this.vertical)
        ? [
            { x: 0, y: this.velocity, duration: this.duration, ease: 'Stepped' },
            { x: 0, y: -this.velocity, duration: this.duration, ease: 'Stepped' }
          ]
        : [
            { x: this.velocity, y: 0, duration: this.duration, ease: 'Stepped' },
            { x: -this.velocity, y: 0, duration: this.duration, ease: 'Stepped' }
          ]
    })

    this.enemy.anims.play('default' + texture, true)
  }

  update () {

  }
}

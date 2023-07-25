export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, texture, targetX = null, targetY = null, duration = 1000, scale = 1) {
    super(scene, x, y, texture)

    scene.physics.add.existing(this)
    scene.sys.displayList.add(this)
    scene.sys.updateList.add(this)

    this.scene = scene
    this.defaultX = x
    this.defaultY = y
    this.targetX = targetX
    this.targetY = targetY
    this.duration = duration
    this.setScale(scale, scale)
    this.setSize(this.displayWidth * 0.98, this.displayHeight * 0.98)
    this.body.setAllowGravity(false)
    this.setPushable(false)
    this.setImmovable(true)

    // Animations
    this.scene.anims.create({
      key: 'default_' + texture,
      frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
      frameRate: 3.5,
      repeat: -1
    })

    this.anims.play('default_' + texture, true)

    if (targetX && targetY) {
      this.moveToTarget()
    }
  }

  moveToTarget () {
    this.x = this.defaultX
    this.y = this.defaultY
    this.scene.physics.moveTo(this, this.targetX, this.targetY, null, this.duration)
    this.scene.time.addEvent({ delay: this.duration, callback: this.moveTodefault, callbackScope: this })
  }

  moveTodefault () {
    this.x = this.targetX
    this.y = this.targetY
    this.scene.physics.moveTo(this, this.defaultX, this.defaultY, null, this.duration)
    this.scene.time.addEvent({ delay: this.duration, callback: this.moveToTarget, callbackScope: this })
  }
}

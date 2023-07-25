export default class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, texture, targetX = null, targetY = null, duration = 1000) {
    super(scene, x, y, texture)

    scene.physics.add.existing(this)
    scene.sys.displayList.add(this)
    scene.sys.updateList.add(this)

    this.scene = scene
    this.originX = x
    this.originY = y
    this.targetX = targetX
    this.targetY = targetY
    this.duration = duration

    this.setSize(this.displayWidth, this.displayHeight * 0.65, false)
    this.body.setAllowGravity(false)
    this.setPushable(false)

    if (targetX && targetY) {
      this.moveToTarget()
    }
  }

  moveToTarget () {
    this.x = this.originX
    this.y = this.originY
    this.scene.physics.moveTo(this, this.targetX, this.targetY, null, this.duration)
    this.scene.time.addEvent({ delay: this.duration, callback: this.moveToOrigin, callbackScope: this })
  }

  moveToOrigin () {
    this.x = this.targetX
    this.y = this.targetY
    this.scene.physics.moveTo(this, this.originX, this.originY, null, this.duration)
    this.scene.time.addEvent({ delay: this.duration, callback: this.moveToTarget, callbackScope: this })
  }
}

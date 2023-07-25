export default class Enemy2 extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, texture, targetX, targetY, duration, scale) {
    super(scene, x, y, 'red_enemy')
    // scene.events.on('update', this.update, this)

    scene.physics.add.existing(this)
    scene.sys.displayList.add(this)
    scene.sys.updateList.add(this)

    this.body.setAllowGravity(false)

    this.duration = duration
    this.targetX = targetX
    this.defaultX = x

    // Animations
    this.scene.anims.create({
      key: 'default2',
      frames: this.scene.anims.generateFrameNumbers('red_enemy', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.play('default2', true)
  }

  update () {
  }
}

export class CameraController {
  constructor (scene) {
    this.scene = scene
  }

  update () {
    const playerScrollCenterY = this.scene.player.body.y - this.scene.player.body.height - (this.scene.cameras.main.displayHeight / 2)
    const distanceFromCamera = Math.abs(this.scene.cameras.main.scrollY - playerScrollCenterY)
    if (this.scene.cameras.main.scrollY < playerScrollCenterY) {
      this.scene.cameras.main.scrollY = Math.min(this.scene.cameras.main.scrollY + distanceFromCamera * 0.01, (this.scene.physics.world.bounds.height - 500) - this.scene.cameras.main.displayHeight)
    } else if (this.scene.cameras.main.scrollY > playerScrollCenterY) {
      this.scene.cameras.main.scrollY = Math.max(this.scene.cameras.main.scrollY - distanceFromCamera * 0.01, -700)
    }
    this.scene.background.y = (this.scene.cameras.main.scrollY * 0.5) - this.scene.cameras.main.displayHeight / 2
    this.scene.bg_planets.y = (this.scene.cameras.main.scrollY * 0.3) - 300
  }
}

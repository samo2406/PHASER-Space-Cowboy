export class CameraController {
  constructor (scene) {
    this.scene = scene
  }

  update () {
    const playerScrollCenterY = this.scene.player.player.body.y - this.scene.player.player.body.height - (this.scene.cameras.main.displayHeight / 2)
    const distanceFromCamera = Math.abs(this.scene.cameras.main.scrollY - playerScrollCenterY)
    if (this.scene.cameras.main.scrollY < playerScrollCenterY) {
      this.scene.cameras.main.scrollY = Math.min(this.scene.cameras.main.scrollY + distanceFromCamera * 0.01, this.scene.background.displayHeight - this.scene.cameras.main.displayHeight)
    } else if (this.scene.cameras.main.scrollY > playerScrollCenterY) {
      this.scene.cameras.main.scrollY = Math.max(this.scene.cameras.main.scrollY - distanceFromCamera * 0.01, this.scene.cameras.main.displayHeight / 2)
    }
  }
}

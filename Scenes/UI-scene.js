export class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene', active: true })

    this.soundOn = true
  }

  preload () {
    this.load.spritesheet('sign_animated', './Assets/timer_sign.png', { frameWidth: 172, frameHeight: 102 })

    this.load.image('sound_button_on', './Assets/on-big.png')
    this.load.image('sound_button_on2', './Assets/on-small.png')
    this.load.image('sound_button_off', './Assets/off-big.png')
    this.load.image('sound_button_off2', './Assets/off-small.png')
  }

  create () {
    this.anims.create({
      key: 'sign_falling',
      frames: this.anims.generateFrameNumbers('sign_animated', { start: 0, end: 10 }),
      frameRate: 8,
      repeat: 0
    })

    this.sign = this.add.sprite(920, 50)

    // Sound button
    this.button = this.add.sprite(985, 730, 'sound_button_on').setInteractive()
    this.button.setScale(0.55, 0.55)

    this.button.on('pointerdown', async function () {
      if (this.soundOn) {
        this.soundOn = false
        this.button.setTexture('sound_button_on2')
        this.time.addEvent({ delay: 250, callback: () => { this.button.setTexture('sound_button_off') }, callbackScope: this })
      } else {
        this.soundOn = true
        this.button.setTexture('sound_button_off2')
        this.time.addEvent({ delay: 250, callback: () => { this.button.setTexture('sound_button_on') }, callbackScope: this })
      }
    }, this)

    this.timerDisplay = this.add.text(860, 57, '00:00:000', { fontFamily: 'retro', fontSize: '21px', fill: '#b3b3b3' })
    this.timerDisplay.setAlpha(0)
  }

  setTimer (time) {
    const min = Math.floor(((time / 1000) / 60)).toString().padStart(2, '0')
    const sec = Math.floor(((time / 1000) - (60 * min))).toString().padStart(2, '0')
    const ms = Math.floor(time - (1000 * sec) - (60 * min * 1000)).toString().padStart(3, '0')
    this.timerDisplay.setText(`${min}:${sec}:${ms}`)
  }
}

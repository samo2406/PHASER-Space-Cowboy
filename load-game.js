import { levelScene } from './Scenes/level-scene.js'
import { UIScene } from './Scenes/UI-scene.js'

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 5000 },
      debug: false
    }
  },
  scene: [levelScene, UIScene]
}

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config)

import { startScene } from './Scenes/start-scene.js'
import { levelScene } from './Scenes/level-scene.js'

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
  scene: [startScene, levelScene]
}

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config)

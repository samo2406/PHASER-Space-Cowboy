import Enemy from '../GameObjects/enemy.js'
import Platform from '../GameObjects/platform.js'

export function spawnEnemies (scene) {
  scene.enemies = scene.add.group()
  scene.enemies.add(new Enemy(scene, 800, 1700, 'red_enemy', 800, 2250, 1000, 0.6))
  scene.enemies.add(new Enemy(scene, 50, 2150, 'green_enemy', 350, 2150, 1000, 0.6))
  scene.enemies.add(new Enemy(scene, 530, 1050, 'orange_enemy', 830, 1050, 750, 0.6))
  // scene.enemies.add(new Enemy(scene, 260, 1700, 'blue_enemy', 420, 2400, 1000, 0.6))
}

export function spawnPlatforms (scene) {
  scene.platforms = scene.add.group({ allowGravity: false })
  scene.platforms.add(new Platform(scene, scene.background.displayWidth / 2, scene.physics.world.bounds.height - 500, 'platform0'))
  scene.platforms.add(new Platform(scene, 420, 2600, 'platform2'))
  scene.platforms.add(new Platform(scene, 700, 2700, 'platform1'))

  scene.platforms.add(new Platform(scene, 150, 2450, 'platform3'))
  scene.platforms.add(new Platform(scene, 400, 2250, 'platform1', 500, 2250, 1000))
  scene.platforms.add(new Platform(scene, 800, 2250, 'platform1'))
  scene.platforms.add(new Platform(scene, 1000, 2075, 'platform3'))
  scene.platforms.add(new Platform(scene, 800, 1875, 'platform1'))
  scene.platforms.add(new Platform(scene, 400, 1835, 'platform2'))
  scene.platforms.add(new Platform(scene, 25, 1650, 'platform4'))
  scene.platforms.add(new Platform(scene, 195, 1435, 'platform1'))
  scene.platforms.add(new Platform(scene, 420, 1300, 'platform2'))
  scene.platforms.add(new Platform(scene, 960, 1180, 'platform3'))
  scene.platforms.add(new Platform(scene, 550, 1290, 'platform1', 750, 1290, 1000))
  scene.platforms.add(new Platform(scene, 1000, 975, 'platform1'))
  scene.platforms.add(new Platform(scene, 900, 830, 'platform1'))
  scene.platforms.add(new Platform(scene, 475, 675, 'platform4'))
  scene.platforms.add(new Platform(scene, 300, 550, 'platform2'))
  scene.platforms.add(new Platform(scene, 100, 400, 'platform2'))
  scene.platforms.add(new Platform(scene, 350, 250, 'platform2'))
  scene.platforms.add(new Platform(scene, 500, 100, 'platform2'))
  scene.platforms.add(new Platform(scene, 600, -50, 'platform2'))
  scene.platforms.add(new Platform(scene, 900, -150, 'platform4'))

  scene.finishZone = scene.physics.add.existing(new Phaser.GameObjects.Rectangle(scene, 900, -215, 245, 35), true)
}

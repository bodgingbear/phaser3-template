import 'phaser';

import './index.css';

import { LoadingScene } from './scenes/LoadingScene';
import { GameScene } from './scenes/GameScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  banner: true,
  width: 1920,
  height: 1080,
  scene: [LoadingScene, GameScene],
  scale: {
    parent: 'app',
    mode: Phaser.Scale.FIT,
    width: 1920,
    height: 1080,
  },
});

window.addEventListener('load', (): Phaser.Game => game);

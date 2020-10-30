import { loadAsset } from 'packages/utils';

export class LoadingScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'LoadingScene',
    });
  }

  public preload(): void {
    this.load.image('background', loadAsset('images/background.png'));
  }

  public create(): void {}

  public update(): void {
    this.scene.start('GameScene');
  }
}

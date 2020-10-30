import { ResetButton } from 'packages/reset-button';

export class GameScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    this.add.image(1920 / 2, 1080 / 2, 'background');

    new ResetButton(this, 110, 1005);
  }
}

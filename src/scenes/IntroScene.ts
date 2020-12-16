import { TextButton } from 'packages/text-button';

export class IntroScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'IntroScene',
    });
  }

  public create() {
    const skipIntroButton = new TextButton(
      this,
      1280 - 32,
      720 - 32,
      'Skip intro',
      {
        originX: 1,
        originY: 1,
      }
    );
    skipIntroButton.on('click', () => {
      this.sound.stopAll();
      this.scene.start('MainMenuScene', { skipAnimation: true });
    });
  }
}

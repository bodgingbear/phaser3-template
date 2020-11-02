import { TextButton } from 'packages/text-button';
import { centerElement } from 'packages/utils';

export class HowToPlayScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'HowToPlayScene',
    });
  }

  public create(): void {
    const howToPlayButton = new TextButton(this, 32, 720 - 32, 'Back', {
      originX: 0,
      originY: 1,
    });

    howToPlayButton.on('click', () => this.scene.start('MainMenuScene'));

    const text = this.add.text(1280 / 2, 720 / 2, "You'll figure it out", {
      color: 'white',
      fontSize: 32,
      fontFamily: 'Pixel miners',
      align: 'center',
    });
    centerElement(text);
  }
}

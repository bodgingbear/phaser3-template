export class MainMenuScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'MainMenuScene',
    });
  }

  public create(): void {
    const vid = this.add.video(1280 / 2, 720 / 2, 'demo');
    vid.play(true);
    vid.setDisplaySize(1280, 720);
    vid.setAlpha(0.75);

    const text = this.add.text(1280 / 2, 720 / 2 - 200, 'Phaser 3 Template', {
      fontSize: '48px',
      fill: '#fff',
      fontFamily: 'Pixel miners',
      align: 'center',
      lineSpacing: 10,
    });

    text.setOrigin(0.5, 0.5);

    const pressAnyButton = this.add.text(
      1280 / 2,
      720 / 2 + 200,
      'Press any button to start',
      {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Pixel miners',
        align: 'center',
        lineSpacing: 10,
      }
    );

    pressAnyButton.setOrigin(0.5, 0.5);

    this.input.keyboard.on('keydown', (): void => {
      this.scene.start('GameScene');
    });
  }
}

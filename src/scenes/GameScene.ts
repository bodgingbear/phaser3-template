export class GameScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    const text = this.add.text(1280 / 2, 720 / 2, 'Here is the game', {
      fontSize: '48px',
      fill: '#fff',
      align: 'center',
      lineSpacing: 10,
    });

    text.setOrigin(0.5, 0.5);
  }
}

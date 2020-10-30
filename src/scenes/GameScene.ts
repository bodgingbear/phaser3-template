export class GameScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create(): void {
    const vid = this.add.video(1280 / 2, 720 / 2, 'demo');
    vid.play(true);
    vid.setDisplaySize(1280, 720);
  }
}

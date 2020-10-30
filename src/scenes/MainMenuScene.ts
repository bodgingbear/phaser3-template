export default class MainMenuScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'MainMenuScene',
    });
  }

  create() {
    const demoBg = this.add.image(640, 360, 'logo');
    demoBg.setOrigin(0.5);
  }
}

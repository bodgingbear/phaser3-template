export default class BootScene extends Phaser.Scene {
  public constructor() {
    super({
      key: 'BootScene',
    });
  }

  public preload(): void {
    this.load.image('introFrame0', 'assets/images/intro/intro_frame0.png');
    this.load.image('introFrame1', 'assets/images/intro/intro_frame1.png');
    this.load.image('introFrame2', 'assets/images/intro/intro_frame2.png');
    this.load.image('introFrame3', 'assets/images/intro/intro_frame3.png');
    this.load.image('introFrame4', 'assets/images/intro/intro_frame4.png');
    this.load.image('introFrame5', 'assets/images/intro/intro_frame5.png');
    this.load.image('introFrame6', 'assets/images/intro/intro_frame6.png');
    this.load.image('introFrame7', 'assets/images/intro/intro_frame7.png');
    this.load.image('introFrame8', 'assets/images/intro/intro_frame8.png');
    this.load.image('introFrame9', 'assets/images/intro/intro_frame9.png');
    this.load.image('introFrame10', 'assets/images/intro/intro_frame10.png');
    this.load.image('introFrame11', 'assets/images/intro/intro_frame11.png');
  }

  public create(): void {
    this.scene.start('LoadingScene');
  }
}

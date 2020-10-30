import { createAnimation } from '../utils/createAnimation';
import shouldSkipIntro from '../utils/shouldSkipIntro';

export default class BootScene extends Phaser.Scene {
  private introImage: Phaser.GameObjects.Sprite;

  private timesLooped: number;

  private animStopped: boolean;

  public constructor() {
    super({
      key: 'LoadingScene',
    });

    this.timesLooped = 0;
    this.animStopped = false;
  }

  private showLoadingAnimation(): void {
    this.anims.create(createAnimation(
      'intro',
      10,
      'introFrame',
      // @ts-ignore
      {
        frameRate: 10,
        repeat: 0,
      },
    ));

    this.anims.create(createAnimation(
      'intro-loop',
      2,
      'introFrame1',
      // @ts-ignore
      {
        frameRate: 3,
        repeat: -1,
      },
    ));

    this.introImage = this.add.sprite(0, 0, 'introFrame0');
    this.introImage.setOrigin(0, 0);
    this.introImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.introImage.anims.play('intro');
    this.introImage.anims.chain('intro-loop');

    this.introImage.on('animationrepeat', (animation: Phaser.Animations.Animation): void => {
      if (animation.key === 'intro-loop') {
        this.timesLooped += 1;
      }
    }, this);
  }

  public preload(): void {
    if (!shouldSkipIntro()) {
      this.showLoadingAnimation();
    }

    this.load.image('logo', 'assets/phaser3-logo.png');
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  public create(): void {}

  private changeScene(): void {
    this.scene.start('GameScene');
    this.scene.start('MainMenuScene');
    this.scene.bringToTop('MainMenuScene');
  }

  private playEndingAnimation(): void {
    this.animStopped = true;
    this.introImage.anims.stop();
    this.introImage.anims.playReverse('intro');
    this.introImage.on('animationcomplete', this.changeScene, this);
  }

  public update(): void {
    if (shouldSkipIntro()) {
      this.changeScene();
      return;
    }

    if (!this.animStopped && this.timesLooped > 2) {
      this.playEndingAnimation();
    }
  }
}

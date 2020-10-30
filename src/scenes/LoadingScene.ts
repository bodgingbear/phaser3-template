import { loadAsset } from 'packages/utils';
import { shouldSkipIntro } from 'packages/utils/shouldSkipIntro';

export class LoadingScene extends Phaser.Scene {
  private introImage!: Phaser.GameObjects.Sprite;

  private timesLooped = 0;

  private animStopped = false;

  public constructor() {
    super({
      key: 'LoadingScene',
    });
  }

  private loadAssets() {
    // Assets go here
    this.load.video(
      'demo',
      loadAsset('videos/demo.mp4'),
      'loadeddata',
      false,
      true
    );
  }

  public preload(): void {
    if (!shouldSkipIntro()) {
      this.showLoadingAnimation();
    }

    this.loadAssets();
  }

  public create(): void {}

  public update(): void {
    if (shouldSkipIntro()) {
      this.changeScene();
      return;
    }

    if (!this.animStopped && this.timesLooped > 2) {
      this.playEndingAnimation();
    }
  }

  private showLoadingAnimation = () => {
    this.introImage = this.add.sprite(0, 0, 'intro', 11);
    this.introImage.setOrigin(0, 0);
    this.introImage.setDisplaySize(
      this.cameras.main.width,
      this.cameras.main.height
    );

    this.introImage.anims.play('intro-start');
    this.introImage.anims.chain('intro-loop');

    this.introImage.on(
      'animationrepeat',
      (animation: Phaser.Animations.Animation): void => {
        if (animation.key === 'intro-loop') {
          this.timesLooped += 1;
        }
      }
    );
  };

  private playEndingAnimation = () => {
    this.animStopped = true;
    this.introImage.anims.stop();
    this.introImage.anims.playReverse('intro-start');
    this.introImage.on('animationcomplete', this.changeScene);
  };

  private changeScene = () => {
    this.scene.start('MainMenuScene');
  };
}

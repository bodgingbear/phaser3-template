import { TeamMember } from 'packages/credits';
import { TextButton } from 'packages/text-button';
import { TEAM } from '../constants';

const SCROLL_SPEED = 10000 / 6;

export class CreditsScene extends Phaser.Scene {
  private membersContainer!: Phaser.GameObjects.Container;

  public constructor() {
    super({
      key: 'CreditsScene',
    });
  }

  public create(): void {
    const background = this.add.sprite(1280 / 2, 720 / 2, 'credits_background');
    background.setDisplaySize(1280, 720);

    const logo = this.add
      .sprite(1280 / 2, 64, 'credits_logo')
      .setPosition(this.cameras.main.width - 32, this.cameras.main.height - 32)
      .setOrigin(1, 1)
      .setScale(5);

    logo.setInteractive({ useHandCursor: true, pixelPerfect: true });
    logo.on('pointerup', () => {
      window.open('https://bodgingbear.dev');
    });
    logo.on('pointerover', () => {
      logo.setTexture('credits_logo_hover');
    });
    logo.on('pointerout', () => {
      logo.setTexture('credits_logo');
    });

    const backButton = new TextButton(
      this,
      32,
      this.cameras.main.height - 32,
      'Back',
      {
        originX: 0,
        originY: 1,
      }
    );

    backButton.on('click', () => this.scene.start('MainMenuScene'));

    const Y_OFFSET = 48;

    this.membersContainer = this.add.container(0, 0);

    const members = TEAM.reduce((acc, teamMember, i) => {
      return [
        ...acc,
        new TeamMember(
          this,
          0,
          ((acc[0]?.getDimensions().height ?? 0) + Y_OFFSET) * i,
          teamMember,
          this.membersContainer
        ),
      ];
    }, [] as TeamMember[]);

    const maxWidth = Math.max(
      ...members.map((teamMember) => teamMember.getDimensions().width)
    );

    const totalHeight =
      members[0].getDimensions().height * members.length +
      Y_OFFSET * (members.length - 1);

    this.membersContainer.setX(this.cameras.main.width / 2 - maxWidth / 2);

    const logoSize = logo.displayHeight / 2 + logo.y;
    const scrollArea = this.cameras.main.height - logoSize;

    const scrollAreaY = logoSize + scrollArea / 2;

    if (totalHeight > scrollArea) {
      this.tweens.add({
        targets: this.membersContainer,
        y: {
          from: this.cameras.main.height,
          to: -totalHeight,
        },
        duration: SCROLL_SPEED * members.length,
        repeat: -1,
      });
    } else {
      this.membersContainer.setY(scrollAreaY - totalHeight / 2);
    }
  }
}

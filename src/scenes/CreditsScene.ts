import { TEAM } from "../constants";
import { TeamMember } from "../types/TeamMember";
import { TextButton } from "../components/TextButton/TextButton";

const SCROLL_SPEED = 10000 / 6;
const MEMBERS_MARGIN = 48;

export class CreditsScene extends Phaser.Scene {
  private membersContainer!: Phaser.GameObjects.Container;

  public constructor() {
    super({
      key: "CreditsScene",
    });
  }

  public create(): void {
    const { width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT } = this.cameras.main;

    const background = this.add.sprite(DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2, "credits_background");
    background.setDisplaySize(DISPLAY_WIDTH, DISPLAY_HEIGHT);

    const logo = this.add
      .sprite(DISPLAY_WIDTH / 2, 64, "credits_logo")
      .setPosition(DISPLAY_WIDTH - 32, DISPLAY_HEIGHT - 32)
      .setOrigin(1, 1)
      .setScale(5);

    logo.setInteractive({ useHandCursor: true, pixelPerfect: true });
    logo.on("pointerup", () => {
      window.open("https://bodgingbear.dev");
    });
    logo.on("pointerover", () => {
      logo.setTexture("credits_logo_hover");
    });
    logo.on("pointerout", () => {
      logo.setTexture("credits_logo");
    });

    const backButton = new TextButton(this, 32, DISPLAY_HEIGHT - 32, "Back", {
      originX: 0,
      originY: 1,
    });

    backButton.on("click", () => this.scene.start("MainMenuScene"));

    this.membersContainer = this.add.container(0, 0);

    const members = TEAM.reduce((acc, teamMember, i) => {
      return [
        ...acc,
        new TeamMember(
          this,
          0,
          ((acc[0]?.getDimensions().height ?? 0) + MEMBERS_MARGIN) * i,
          teamMember,
          this.membersContainer,
        ),
      ];
    }, [] as TeamMember[]);

    const maxWidth = Math.max(...members.map((teamMember) => teamMember.getDimensions().width));

    const totalHeight = members[0].getDimensions().height * members.length + MEMBERS_MARGIN * (members.length - 1);

    this.membersContainer.setX(DISPLAY_WIDTH / 2 - maxWidth / 2);

    if (totalHeight > DISPLAY_HEIGHT) {
      this.tweens.add({
        targets: this.membersContainer,
        y: {
          from: DISPLAY_HEIGHT,
          to: -totalHeight,
        },
        duration: SCROLL_SPEED * members.length,
        repeat: -1,
      });
    } else {
      this.membersContainer.setY(DISPLAY_HEIGHT / 2 - totalHeight / 2);
    }
  }
}

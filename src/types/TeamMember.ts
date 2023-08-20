export interface TeamMemberData {
  name: string;
  role: string;
  imageKey: string;
  imagePath: string;
}

const ROLE_TEXT_MARGIN = 8;

export class TeamMember {
  private image: Phaser.GameObjects.Image;

  private container: Phaser.GameObjects.Container;

  private width: number;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    data: TeamMemberData,
    groupContainer: Phaser.GameObjects.Container,
  ) {
    this.container = this.scene.add.container(x, y);

    this.image = this.scene.add.image(0, 0, data.imageKey);
    this.image.setScale(2.5);
    this.image.setOrigin(0, 0);

    const TEXT_X = this.image.displayWidth + 32;

    const textContainer = this.scene.add.container(TEXT_X, 0);

    const nameText = this.scene.add.text(0, 0, data.name, {
      fontSize: "32px",
      align: "left",
    });

    const roleText = this.scene.add.text(0, nameText.displayHeight + ROLE_TEXT_MARGIN, data.role, {
      fontSize: "20px",
      align: "left",
      color: "#9E9E9E",
    });

    this.width = TEXT_X + Math.max(nameText.displayWidth, roleText.displayWidth);

    textContainer.setY(nameText.displayHeight);
    textContainer.add(nameText);
    textContainer.add(roleText);
    this.container.add(textContainer);
    this.container.add(this.image);

    if (groupContainer) {
      groupContainer.add(this.container);
    }
  }

  public getDimensions = () => ({
    width: this.width,
    height: this.image.displayHeight,
  });

  public setX = (x: number) => this.container.setX(x);
}

import { Bodyish } from "../../types/Bodyish";

const moveByParentPosition = (element: Bodyish | Phaser.GameObjects.Container, vector: Phaser.Math.Vector2) => {
  const parent = element.parentContainer;

  if (parent) {
    vector.add(new Phaser.Math.Vector2(parent.x + parent.displayWidth / 2, parent.y + parent.displayHeight / 2));

    moveByParentPosition(parent, vector);
  }
};

export const getAbsolutePosition = (element: Bodyish): Phaser.Math.Vector2 => {
  const position = new Phaser.Math.Vector2(element.x, element.y);

  moveByParentPosition(element, position);

  return position;
};

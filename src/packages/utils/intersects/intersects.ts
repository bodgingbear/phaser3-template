import { Bodyish } from '../Bodyish';

export function intersectsInX(
  spriteA: Bodyish,
  spriteB: Bodyish,
  customWidth?: number
): boolean {
  const spriteALeft = spriteA.x - spriteA.displayWidth / 2;
  const spriteARight = spriteA.x + spriteA.displayWidth / 2;

  const spriteBLeft = spriteB.x - (customWidth || spriteB.displayWidth) / 2;
  const spriteBRight = spriteB.x + (customWidth || spriteB.displayWidth) / 2;

  const leftCheck = spriteARight >= spriteBLeft;
  const rightCheck = spriteALeft <= spriteBRight;

  return leftCheck && rightCheck;
}

export function intersectsInY(spriteA: Bodyish, spriteB: Bodyish): boolean {
  const spriteABottom = spriteA.y + spriteA.displayHeight / 2;
  const spriteBTop = spriteB.y - spriteB.displayHeight / 2;

  const spriteATop = spriteA.y - spriteA.displayHeight / 2;
  const spriteBBottom = spriteB.y + spriteB.displayHeight / 2;

  const bottomCheck = spriteABottom >= spriteBTop;
  const topCheck = spriteATop <= spriteBBottom;

  return bottomCheck && topCheck;
}

export function intersects(
  spriteA: Bodyish,
  spriteB: Bodyish,
  customWidth?: number
): boolean {
  return (
    intersectsInX(spriteA, spriteB, customWidth) &&
    intersectsInY(spriteA, spriteB)
  );
}

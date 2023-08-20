import { Bodyish } from "../../types/Bodyish";

export function intersectsInX(spriteA: Bodyish, spriteB: Bodyish, customSpriteBWidth?: number): boolean {
  const spriteALeft = spriteA.x - spriteA.displayWidth / 2;
  const spriteARight = spriteA.x + spriteA.displayWidth / 2;

  const spriteBLeft = spriteB.x - (customSpriteBWidth ?? spriteB.displayWidth) / 2;
  const spriteBRight = spriteB.x + (customSpriteBWidth ?? spriteB.displayWidth) / 2;

  const leftCheck = spriteARight >= spriteBLeft;
  const rightCheck = spriteALeft <= spriteBRight;

  return leftCheck && rightCheck;
}

export function intersectsInY(spriteA: Bodyish, spriteB: Bodyish, customSpriteBHeight?: number): boolean {
  const spriteABottom = spriteA.y + spriteA.displayHeight / 2;
  const spriteBTop = spriteB.y - (customSpriteBHeight ?? spriteB.displayHeight) / 2;

  const spriteATop = spriteA.y - spriteA.displayHeight / 2;
  const spriteBBottom = spriteB.y + (customSpriteBHeight ?? spriteB.displayHeight) / 2;

  const bottomCheck = spriteABottom >= spriteBTop;
  const topCheck = spriteATop <= spriteBBottom;

  return bottomCheck && topCheck;
}

export function intersects(
  spriteA: Bodyish,
  spriteB: Bodyish,
  customSpriteBWidth?: number,
  customSpriteBHeight?: number,
): boolean {
  return intersectsInX(spriteA, spriteB, customSpriteBWidth) && intersectsInY(spriteA, spriteB, customSpriteBHeight);
}

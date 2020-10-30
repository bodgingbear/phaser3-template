import { Bodyish } from '../Bodyish';

export const centerElement = (object: Bodyish) => {
  object.setPosition(
    object.x - object.displayWidth / 2,
    object.y - object.displayHeight / 2
  );
};

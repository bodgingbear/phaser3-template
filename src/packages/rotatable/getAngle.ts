export const getPositiveAngle = (angle: number): number => {
  if (angle > 0) {
    return angle;
  }

  return angle + Math.PI * 2;
};

export const getAngle = (deltaX: number, deltaY: number): number => {
  const rad = Math.atan2(deltaY, deltaX);

  return getPositiveAngle(rad);
};

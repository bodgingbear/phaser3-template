import { DebugObject } from "./DebugObject";
import type { AllowedKeys, KeysConfig } from "./types";

export class Debug {
  private static TOGGLE_VISIBILITY_KEY: AllowedKeys = "H";

  private static PRINT_KEY: AllowedKeys = "P";

  private static TOGGLE_TEXT_KEY: AllowedKeys = "T";

  private static debugObjects: DebugObject[] = [];

  private static getKeysObject(): KeysConfig {
    return {
      toggle: Debug.TOGGLE_VISIBILITY_KEY,
      print: Debug.PRINT_KEY,
      text: Debug.TOGGLE_TEXT_KEY,
    };
  }

  /**
   * Sets the key that will be used to toggle debug overlay. The default value is `H`\
   * For possible values please refer to https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/#key-map
   */
  static setToggleVisibilityKey(key: AllowedKeys) {
    Debug.TOGGLE_VISIBILITY_KEY = key;
  }

  /**
   * Sets the key that will be used to console log the object's value. The default value is `P`\
   * For possible values please refer to https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/#key-map
   */
  static setPrintKey(key: AllowedKeys) {
    Debug.PRINT_KEY = key;
  }

  /**
   * Sets the key that will be used to toggle text info overlay. The default value is `T`\
   * For possible values please refer to https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/#key-map
   */
  static setTextToggleKey(key: AllowedKeys) {
    Debug.TOGGLE_TEXT_KEY = key;
  }

  /**
   * Wrapper around the `scene.add.zone`
   * @param scene Scene in which the zone will be created in
   * @param x X parameter of the position for the newly created zone
   * @param y Y parameter of the position for the newly created zone
   * @param width Width of the newly created zone
   * @param height Height of the newly created zone
   * @param originX X origin of the created zone, defaults to 0.5
   * @param originY Y origin of the created zone, defaults to 0.5
   * @param debug If set to true, it will behave the same way as `ObjectDebug.debugZone`
   */
  static createZone(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    originX: number = 0.5,
    originY: number = 0.5,
    debug: boolean = false,
  ) {
    const gameZone = scene.add.zone(x, y, width, height);
    gameZone.setOrigin(originX, originY);

    if (debug) {
      const newDO = new DebugObject(
        scene,
        gameZone,
        Debug.getKeysObject(),
        this.debugObjects,
        x,
        y,
        width,
        height,
        originX,
        originY,
      );

      Debug.debugObjects.push(newDO);
    }

    return gameZone;
  }

  /**
   * Creates an easily debuggable version of a zone. While in production use `createZone`
   * * To change the zone's position drag and drop it
   * * To change its size drag and drop one of its edges
   * * While changing size hold `ALT` to transform it based on the origin
   * * While changing size hold `SHIFT` to preserve object's aspect ratio
   * * Clicking `H` will disable the debug overlay
   * * Clicking `P` will print the object's values to the console
   * * You can also manipulate the object using the arrow keys and the following modifiers
   *   * `Shift` will change the object's value with an increment of 10
   *   * `Alt` will change the object's size
   * @param scene Scene in which the zone will be created in
   * @param x X parameter of the position for the newly created zone
   * @param y Y parameter of the position for the newly created zone
   * @param width Width of the newly created zone
   * @param height Height of the newly created zone
   * @param originX X origin of the created zone, defaults to 0.5
   * @param originY Y origin of the created zone, defaults to 0.5
   */
  static debugZone(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    originX?: number,
    originY?: number,
  ) {
    return Debug.createZone(scene, x, y, width, height, originX, originY, true);
  }

  /**
   * Wrapper around the `scene.add.rectangle`
   * @param scene Scene in which the rectangle will be created in
   * @param x X parameter of the position for the newly created rectangle
   * @param y Y parameter of the position for the newly created rectangle
   * @param width Width of the newly created rectangle
   * @param height Height of the newly created rectangle
   * @param fillColor A fill color to be set on the newly created rectangle
   * @param fillAlpha An alpha value of the fill color that is set to the rectangle
   * @param originX X origin of the created rectangle, defaults to 0.5
   * @param originY Y origin of the created rectangle, defaults to 0.5
   * @param debug If set to true, it will behave the same way as `ObjectDebug.debugRectangle`
   */
  static createRectangle(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor?: number,
    fillAlpha?: number,
    originX: number = 0.5,
    originY: number = 0.5,
    debug: boolean = false,
  ) {
    const gameZone = scene.add.rectangle(x, y, width, height, fillColor, fillAlpha);
    gameZone.setOrigin(originX, originY);

    if (debug) {
      const newDO = new DebugObject(
        scene,
        gameZone,
        Debug.getKeysObject(),
        this.debugObjects,
        x,
        y,
        width,
        height,
        originX,
        originY,
      );

      Debug.debugObjects.push(newDO);
    }

    return gameZone;
  }

  /**
   * Creates an easily debuggable version of a rectangle. While in production use `createRectangle`
   * * To change the rectangle's position drag and drop it
   * * To change its size drag and drop one of its edges
   * * While changing size hold `ALT` to transform it based on the origin
   * * While changing size hold `SHIFT` to preserve object's aspect ratio
   * * Clicking `H` will disable the debug overlay
   * * Clicking `P` will print the object's values to the console
   * * You can also manipulate the object using the arrow keys and the following modifiers
   *   * `Shift` will change the object's value with an increment of 10
   *   * `Alt` will change the object's size
   * @param scene Scene in which the rectangle will be created in
   * @param x X parameter of the position for the newly created rectangle
   * @param y Y parameter of the position for the newly created rectangle
   * @param width Width of the newly created rectangle
   * @param height Height of the newly created rectangle
   * @param fillColor A fill color to be set on the newly created rectangle
   * @param fillAlpha An alpha value of the fill color that is set to the rectangle
   * @param originX X origin of the created rectangle, defaults to 0.5
   * @param originY Y origin of the created rectangle, defaults to 0.5
   */
  static debugRectangle(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor?: number,
    fillAlpha?: number,
    originX?: number,
    originY?: number,
  ) {
    return Debug.createRectangle(scene, x, y, width, height, fillColor, fillAlpha, originX, originY, true);
  }

  /**
   * Wrapper around the `scene.add.sprite`
   * @param scene Scene in which the sprite will be created in
   * @param x X parameter of the position for the newly created sprite
   * @param y Y parameter of the position for the newly created sprite
   * @param texture Texture that will be assigned to the sprite
   * @param originX X origin of the created texture, defaults to 0.5
   * @param originY Y origin of the created texture, defaults to 0.5
   * @param debug If set to true, it will behave the same way as `ObjectDebug.debugSprite`
   */
  static createSprite(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    originX: number = 0.5,
    originY: number = 0.5,
    debug: boolean = false,
  ) {
    const gameZone = scene.add.sprite(x, y, texture);
    gameZone.setOrigin(originX, originY);

    if (debug) {
      const newDO = new DebugObject(
        scene,
        gameZone,
        Debug.getKeysObject(),
        this.debugObjects,
        x,
        y,
        gameZone.displayWidth,
        gameZone.displayHeight,
        originX,
        originY,
      );

      Debug.debugObjects.push(newDO);
    }

    return gameZone;
  }

  /**
   * Creates an easily debuggable version of a sprite. While in production use `createSprite`
   * * To change the sprite's position drag and drop it
   * * To change its size drag and drop one of its edges
   * * While changing size hold `ALT` to transform it based on the origin
   * * While changing size hold `SHIFT` to preserve object's aspect ratio
   * * Clicking `H` will disable the debug overlay
   * * Clicking `P` will print the object's values to the console
   * * You can also manipulate the object using the arrow keys and the following modifiers
   *   * `Shift` will change the object's value with an increment of 10
   *   * `Alt` will change the object's size
   * @param scene Scene in which the sprite will be created in
   * @param x X parameter of the position for the newly created sprite
   * @param y Y parameter of the position for the newly created sprite
   * @param texture Texture that will be assigned to the sprite
   * @param originX X origin of the created texture, defaults to 0.5
   * @param originY Y origin of the created texture, defaults to 0.5
   */
  static debugSprite(scene: Phaser.Scene, x: number, y: number, texture: string, originX?: number, originY?: number) {
    return Debug.createSprite(scene, x, y, texture, originX, originY, true);
  }
}

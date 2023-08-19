export type AllowedKeys = keyof typeof Phaser.Input.Keyboard.KeyCodes;

export interface KeysConfig {
  toggle: AllowedKeys;
  print: AllowedKeys;
  text: AllowedKeys;
}

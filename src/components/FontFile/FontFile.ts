import WebFont, { Custom, Fontdeck, Google, Monotype, Typekit } from "webfontloader";

export class FontFile extends Phaser.Loader.File {
  constructor(
    loader: Phaser.Loader.LoaderPlugin,
    key: string,
    private fontConfig: {
      custom?: string | string[] | Custom | undefined;
      google?: string | string[] | Google | undefined;
      typekit?: Typekit | undefined;
      fontdeck?: Fontdeck | undefined;
      monotype?: Monotype | undefined;
    },
  ) {
    super(loader, {
      key,
      type: "font",
    });
  }

  private transformFontConfig(): WebFont.Config {
    let custom: Custom | undefined = undefined;
    let google: Google | undefined = undefined;

    if (typeof this.fontConfig.custom === "string") {
      custom = {
        families: [this.fontConfig.custom],
        urls: ["/fonts/fonts.css"],
      };
    } else if (Array.isArray(this.fontConfig.custom)) {
      custom = {
        families: this.fontConfig.custom,
        urls: ["/fonts/fonts.css"],
      };
    } else {
      custom = this.fontConfig.custom;
    }

    if (typeof this.fontConfig.google === "string") {
      google = {
        families: [this.fontConfig.google],
      };
    } else if (Array.isArray(this.fontConfig.google)) {
      google = {
        families: this.fontConfig.google,
      };
    } else {
      google = this.fontConfig.google;
    }

    const output = this.fontConfig as WebFont.Config;

    if (custom == null) {
      delete output.custom;
    } else {
      output.custom = custom;
    }
    if (google == null) {
      delete output.google;
    } else {
      output.google = google;
    }

    return output;
  }

  load(): void {
    WebFont.load({
      ...this.transformFontConfig(),
      classes: false,
      active: () => {
        this.loader.nextFile(this, true);
      },
      inactive: () => {
        this.loader.nextFile(this, false);
      },
    });
  }
}

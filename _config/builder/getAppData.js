/* eslint-disable no-console */
const printYellow = (s) => `\x1B[33m${s}\x1B[0m`;
const isFontPreloaderValid = (fl) => {
  if (fl === undefined) {
    return false;
  }

  if (Array.isArray(fl) === false) {
    return false;
  }

  if (fl.some((o) => typeof o !== 'string' && !Array.isArray(o) && !o[1])) {
    return false;
  }

  return true;
};

const getAppData = () => {
  const packageJson = require('../../package.json');

  const {
    appName = 'Project Name',
    appDescription = 'Bodging Bear New Awesome Game!',
  } = packageJson;

  if (!packageJson.appName) {
    console.log(
      printYellow(
        "Couldn't find the appName field in package.json file. Defaulting name..."
      )
    );
  }

  if (!packageJson.appDescription) {
    console.log(
      printYellow(
        "Couldn't find the description field in package.json file. Defaulting description..."
      )
    );
  }

  if (!isFontPreloaderValid(packageJson.fontPreloader) || packageJson.fontPreloader === undefined) {
    if (packageJson.fontPreloader !== undefined) {
      console.log(printYellow('Font loader config is invalid'));
    }

    return {
      appName,
      appDescription,
    };
  }

  const fontPreloader = packageJson.fontPreloader.map((font) => {
    if (Array.isArray(font)) {
      return font[0];
    }

    return font;
  });

  const googleFonts = packageJson.fontPreloader
    .map((font) => {
      if (Array.isArray(font)) {
        return font[1];
      }

      return undefined;
    })
    .filter(Boolean);

  return {
    appName,
    appDescription,
    fontPreloader,
    googleFonts,
  };
};

module.exports = getAppData;

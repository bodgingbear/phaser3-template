const merge = require('webpack-merge');
const devSetup = require('./webpack.development');
const getAppData = require('./getAppData');

const appData = getAppData();

module.exports = merge(devSetup(true, undefined, appData), {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: './',
  },
});

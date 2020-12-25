const path = require('path');
const { argv } = require('yargs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const getAppData = require('./getAppData');

const outputDir = path.resolve('public');
const entryFilePath = path.resolve('src/index.ts');
const tsconfigPath = path.resolve('tsconfig.json');

module.exports = (isProduction = false, _, appData = getAppData()) => {
  const strict = isProduction || argv.strict || argv.s || false;

  const { appName, appDescription, fontPreloader, googleFonts } = appData;

  return {
    entry: entryFilePath,
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  [
                    'emotion',
                    {
                      labelFormat: '[filename]-[local]',
                    },
                  ],
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-object-rest-spread',
                ],
              },
            },
            ...(strict
              ? [
                  {
                    loader: 'ts-loader',
                    options: {
                      configFile: tsconfigPath,
                    },
                  },
                ]
              : []),
          ],
        },
        {
          test: /\.module\.s(a|c)ss$/,
          loader: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          loader: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'file-loader'],
        },
        {
          test: /\.(md|txt)$/,
          use: ['raw-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|mp3|mp4|woff2?)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[folder]/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: appName,
        description: appDescription,
        template: path.join(__dirname, 'index.ejs'),
        fontPreloader,
        googleFonts,
      }),
      new CopyPlugin([{ from: '_static' }]),
      new Dotenv()
    ],
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: ['.ts', '.js', '.tsx', '.scss', '.sass'],
    },
    output: {
      filename: '[name].bundle.js',
      path: outputDir,
      publicPath: '/',
    },
    devServer: {
      contentBase: outputDir,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};

import serve from 'rollup-plugin-serve';

import devConfig from './rollup.config.dev';

export default {
  ...devConfig,
  plugins: [
    ...devConfig.plugins,

    //  See https://www.npmjs.com/package/rollup-plugin-serve for config options
    serve({
      open: false,
      contentBase: 'dist',
      host: 'localhost',
      port: 8080,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ],
};

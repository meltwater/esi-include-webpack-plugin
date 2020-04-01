// In this example the html input and output are specified in the plugin as globs and multiple html files are edited

const path = require('path');
const EsiIncludeWebpackPlugin = require('@meltwater/esi-include-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new EsiIncludeWebpackPlugin({
      verbose: true,
      esi: [
        {
          name: 'example',
          src: 'https://pastebin.com/raw/Vc7iR5fL',
          noStore: 'off',
          onError: 'continue',
          authorization: 'bearer tokendatablah'
        }
      ]
    })
  ]
};

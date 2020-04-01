// In this example no html files are operated on even though the plugin is added

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

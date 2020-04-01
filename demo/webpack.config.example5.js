// In this example no html files are operated on even though the plugin is added
// html-loader and requiring an html file in the JS does not pull the html file into webpack context

const path = require('path');
const EsiIncludeWebpackPlugin = require('../src/index'); // require('@meltwater/esi-include-webpack-plugin');

module.exports = {
  entry: './src/index-require-html.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader'
      }
    ]
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

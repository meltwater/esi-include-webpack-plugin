// In this example the html file is included by html-webpack-plugin

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EsiIncludeWebpackPlugin = require('../src/index'); // require('@meltwater/esi-include-webpack-plugin');

const sourcePath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');

module.exports = {
  context: sourcePath,
  entry: {
    main: `${sourcePath}/index.js`
  },
  output: {
    path: distPath,
    filename: '[name].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'template.ejs'),
      inject: false
    }),
    new EsiIncludeWebpackPlugin({
      verbose: true,
      esi: [
        {
          name: 'example',
          src: 'https://pastebin.com/raw/Vc7iR5fL',
          noStore: 'off',
          onError: 'continue',
          maxwait: '1500',
          authorization: 'bearer tokendatablah'
        }
      ]
    })
  ]
};

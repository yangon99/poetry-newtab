const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    newtab: './src/newtab.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/newtab.html', to: 'newtab.html' },
        { from: 'src/newtab.css', to: 'newtab.css' },
        { from: 'assets/icons', to: 'icons' },
        { from: 'assets/fonts', to: 'fonts' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};

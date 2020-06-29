const path = require('path');

module.exports = {
  mode: 'production',
  context: path.resolve('./src/'),
  entry: {
    'sendbird.desk.js': './js/login.js',
    'sendbird.desk.css': './sass/widget.scss'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: []
};

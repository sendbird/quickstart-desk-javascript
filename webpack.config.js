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
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8888
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
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass')
            }
          }
        ]
      }
    ]
  },
  plugins: []
};

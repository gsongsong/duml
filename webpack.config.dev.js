const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    dist: './src/index.ts',
    docs: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname),
    library: 'duml',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    hot: false,
    devMiddleware: {
      publicPath: '/docs',
      writeToDisk: true,
    },
  },
};

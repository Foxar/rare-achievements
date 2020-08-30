const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

let plugins = [
  new CopyPlugin({
    patterns: [
      { from: path.resolve(__dirname, 'static') },
    ],
  }),
];

if (!isDevelopment) {
  plugins = plugins.concat([
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
      sourceMaps: isDevelopment,
    }),
  ]);
}

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    'build/application.js': './src/index.jsx',
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'static'),
  },
  optimization: {
    minimize: !isDevelopment,
    providedExports: true,
    usedExports: true,
    concatenateModules: true,
  },
  devtool: isDevelopment ? 'inline-source-map' : undefined,
  performance: { hints: false },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|svg|woff2?)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/build',
          publicPath: '/build',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ]
            }
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              sourceMaps: isDevelopment,
              name: '[name].css',
              outputPath: '/build',
              publicPath: '/build',
            },
          }
        ],
      },
    ],
  },
  plugins
};

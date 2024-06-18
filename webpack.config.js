import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
  entry: './src/main.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 60
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.6, 0.8],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 70
              }
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};

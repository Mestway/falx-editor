const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      // {
      //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
      //   loader: require.resolve('url-loader'),
      //   options: {
      //     limit: 10000,
      //     name: 'static/media/[name].[hash:8].[ext]',
      //   },
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
          test:/\.css$/,
          use:['style-loader','css-loader']
      },
      {
         test:/\.scss$/,
         use:['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(eot|otf|svg|ttf|woff|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 55000,
          },
        },
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.DefinePlugin({
      FALX_SERVER: JSON.stringify("http://127.0.0.1:5000"),
    })
  ],
  devServer: {
    publicPath: '/',
    historyApiFallback: true,
  }
};
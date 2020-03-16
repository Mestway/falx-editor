const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
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
      FALX_SERVER: JSON.stringify("http://clwang-desktop.cs.washington.edu:5000"),
    })
  ],
  devServer: {
    publicPath: '/',
    historyApiFallback: true,
  }
};
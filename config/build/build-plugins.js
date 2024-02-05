const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = function buildPlugins(options) {

  const { plugins: pluginsPaths } = options.paths

  const plugins = [
    new MiniCssExtractPlugin(), // Плагин для вытаскивания собранных стилей в отдельный файл
    new HtmlWebPackPlugin({
      template: pluginsPaths.template,
      filename: pluginsPaths.filename,
      title: 'Simple SPA',
      base: pluginsPaths.base,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.ProvidePlugin({
      "React": "react",
   }),
  ]
  
  return plugins
}
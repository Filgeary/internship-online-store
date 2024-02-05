const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function buildLoaders(options) {
  //Транспиляция JS/JSX/TS/TSX
  const babelLoader = {
    test: /\.(jsx|tsx|js|ts)$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
        },
    },
}
  
  const cssLoader = {
    test: /\.css$/,
    use: [
      {loader: MiniCssExtractPlugin.loader, options: {}},
      {loader: 'css-loader', options: {url: true, import: true}},
    ]
  }

  const lessLoader = {
    test: /\.less$/,
    use: [
      { loader: MiniCssExtractPlugin.loader, options: {} },
      { loader: 'css-loader', options: { url: true, import: true } },
      { loader: 'less-loader', options: { lessOptions: {} } },
    ],
  }

  const assetsLoader = {
    test: /\.(svg|png|swf|jpg|otf|eot|ttf|woff|woff2)(\?.*)?$/,
    type: 'asset',
  }

  return [
    babelLoader,
    cssLoader,
    lessLoader,
    assetsLoader,
  ]
}
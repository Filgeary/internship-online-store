process.env.NODE_ENV = process.env.NODE_ENV || "development";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

let config = {
  context: path.join(__dirname, "/src"), // Директория с исходным кодом приложения
  entry: "index.js", // Главный файл приложения
  output: {
    path: path.join(__dirname, "dist"), // Куда делать оброку
    filename: "[name].js", // Шаблон для названия файлов
    clean: true, // Очистить ./dist перед сборкой
  },
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"], // расширения по умолчанию если не указаны в import
    modules: ["./", "node_modules"], // Где искать файлы подключаемых модулей (пакетов)
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      // Транспиляция JS/JSX
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      // Транспиляция TS/TSX
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Правила обработки подключаемых файлов
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: {} },
          { loader: "css-loader", options: { url: true, import: true } },
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: {} },
          { loader: "css-loader", options: { url: true, import: true } },
          { loader: "less-loader", options: { lessOptions: {} } },
        ],
      },
      {
        test: /\.(svg|png|swf|jpg|otf|eot|ttf|woff|woff2)(\?.*)?$/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(), // Плагин для вытаскивания собранных стилей в отдельный файл
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html",
      title: "Simple SPA",
      base: "/",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

if (process.env.NODE_ENV === "development") {
  config.devtool = "inline-source-map";
  config.devServer = {
    static: path.join(__dirname, "dist"),
    port: 8010,
    historyApiFallback: true,
    proxy: {
      "/api/**": {
        target: "http://example.front.ylab.io",
        secure: false,
        changeOrigin: true,
      },
    },
  };
}

module.exports = config;

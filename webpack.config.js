process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const buildWebpackConfig = require("./config/build/build-webpack-config");
const path = require("path");

module.exports = () => {
	const paths = {
		context: path.join(__dirname, '/src'), // Директория с исходным кодом приложения
    entry: "index.tsx", // Главный файл приложения
    output: {
      path: path.join(__dirname, 'dist'), // Куда делать оброку
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
      modules: ['./', 'node_modules'], // Где искать файлы подключаемых модулей (пакетов)
    },
    plugins: {
      template: './index.html',
      filename: './index.html',
      base: '/'
    },
    devServer: {
      static: path.join(__dirname, 'dist')
    }
	}

  const isDev = process.env.NODE_ENV === 'development'

  const options = {
    paths,
    isDev,
    port: 8010
  }

  return buildWebpackConfig(options)
};
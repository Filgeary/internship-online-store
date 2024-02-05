
const buildResolvers = require('./build-resolvers');
const buildLoaders = require('./build-loaders');
const buildPlugins = require('./build-plugins');
const buildDevServer = require('./build-dev-server');

module.exports = function buildWebpackConfig(options) {
	return {
    context: options.paths.context,
    entry: options.paths.entry, 
    output: {
      path: options.paths.output.path,
      filename: '[name].js', // Шаблон для названия файлов
      clean: true, // Очистить ./dist перед сборкой
    },
    mode: process.env.NODE_ENV,
    resolve: buildResolvers(options),
    module: {
      rules: buildLoaders(options)
    },
    plugins: buildPlugins(options),
    devServer: options.isDev ? buildDevServer(options) : undefined,
    devtool: options.isDev ? 'inline-source-map' : undefined
  }
}
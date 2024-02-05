module.exports = function buildDevServer(options) {

  const { devServer: devServerPaths } = options.paths

  return {
    static: devServerPaths.static,
    port: options.port,
    historyApiFallback: true,
    proxy: {
      '/api/**': {
        target: 'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      }
    }
  }
}
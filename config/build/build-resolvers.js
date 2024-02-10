module.exports = function buildResolvers (options) {
  return {
    extensions: ['.js', '.jsx', '.tsx', '.ts'], // расширения по умолчанию если не указаны в import
      modules: options.paths.resolve.modules,
      alias: {
        '@src': options.paths.resolve.alias.src,
      },
  }
}
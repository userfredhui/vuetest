module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vuetest/'
    : '/',
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8082',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
};

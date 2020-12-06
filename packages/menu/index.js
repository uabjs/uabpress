const path = require('path')
const glob = require('glob')

function getFolder(sourceDir) {
  return glob.sync(path.join(sourceDir, '/**/*.md'), { absolute: false })
        .filter(v => v.indexOf('node_modules') === -1 )
        .map(v => path.relative(sourceDir, v))
}

function createMiddleware (options) {
  return async (ctx, next) => {
    ctx.menu = getFolder(options.sourceDir) //获取文件名菜单
    await next()
  }
}

module.exports = {
  getFolder,
  createMiddleware
}

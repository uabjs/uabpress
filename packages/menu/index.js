const path = require('path')
const glob = require('glob')

function getFolder(sourceDir) {
  return glob.sync(path.join(sourceDir, '/**/*.md'), { absolute: false })
        .filter(v => v.indexOf('node_modules') === -1 )
        .map(v => path.relative(sourceDir, v))
}

function createMiddleware (options) {
  return async (ctx, next) => {
    ctx.menu = getFolder(options.sourceDir)
    console.log("菜单是：", ctx.menu);
    await next()
  }
}

module.exports = {
  getFolder,
  createMiddleware
}

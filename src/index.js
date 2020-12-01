const fs = require('fs')
const path = require('path')
const { createServer } = require('./devserver')
const { createMiddleware } = require('./menu')
// const provider = require('./markdown')

module.exports.wrapCommand = options => {
  // provider.resolvePath = filePath => path.resolve(options.root, './' + filePath)

  const app = createServer({ sourceDir: options.sourceDir })
  app.use(createMiddleware(options))

  //处理静态资源
  app.use(async (ctx, next) => {
    if (ctx.url.startsWith('./assets')) {
      try {
        const buffer = fs.readFileSync(path.resolve(__dirname, './' + ctx.url))
        ctx.type = path.extname(ctx.url).slice(1)
        ctx.body = buffer
      } catch(e) {
        ctx.body = ''
      }
    } else {
      await next()
    }
  })

  app.start(options.port, () => {
    console.log('编译的docs目录: ' + path.resolve(options.sourceDir))
  })
}

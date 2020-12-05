const fs = require('fs')
const path = require('path')
const { createServer } = require('./devserver')
const { createMiddleware } = require('./menu')
const provider = require('./markdown')

module.exports.wrapCommand = options => {
  provider.resolvePath = filePath => path.resolve(options.sourceDir, './' + filePath)

  const app = createServer({ sourceDir: options.sourceDir }) //监听文件修改
  app.use(createMiddleware(options)) // 往 ctx 注入 menu 文件列表

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

  app.use(async (ctx, next) => {
    if (ctx.url === '/favicon.ico') {
      ctx.body = ''
      return
    }
    await next()
  })

  app.use(async (ctx, next) => {
    await provider.path(ctx.menu)
    const { request: { url, query } } = ctx
    const reqPath = url.split('?')[0]
    const reqFile = path.extname(reqPath) === '' ? reqPath + '/README.md' : reqPath
  })

  app.start(options.port, () => {
    console.log('编译的docs目录: ' + path.resolve(options.sourceDir))
  })
}

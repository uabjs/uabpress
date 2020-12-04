const path = require('path')
const http = require('http')
const watch = require('watch')
const Koa = require('koa')
const io = require('socket.io')
const progress = require('../util/progress')

module.exports.createServer = options => {
  const app = new Koa()
  const server = http.createServer(app.callback())
  const socket = io(server)

  watch.watchTree(options.sourceDir, changePath => {
    progress.init()
    progress.step()
    socket.emit('reload', changePath) //docs 改变重新加载
  })

  app.use(async (ctx, next) => {
    await next()
    if (ctx.type === 'text/html') {
      ctx.body = `
      <!DOCTYPE html>
      <html>
        <script src="https://cdn.bootcss.com/socket.io/2.2.0/socket.io.js"></script>
        <script>
          var socket = io()
          socket.on("reload", function(changePath) {
              window.location.reload()
          })
        </script>
        ${ctx.body}
      </html>
      `
    }
  })

  return {
    start: (port, cb) => {
      server.listen(port, cb)
    },
    use: (...args) => {
      app.use(...args)
    }
  }
}

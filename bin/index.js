#!/usr/bin/env node
const path = require('path')
const { promisify } = require('util')
const open = require("open")
const clear = require('clear')
const figlet = require('figlet')
const program = require('commander')
const chalkAnimation = require('chalk-animation')
const { wrapCommand } = require('../src/index')

const figletAsync = promisify(figlet)
program.version(require('../package.json').version)

program
  .command('dev')
  .description('本地运行开发环境项目')
  .usage('[sourceDir] root-path')
  .option('-t, --theme [theme]', 'Markdown theme is default or techo')
  .option('-p, --port [port]', '开启服务器端口')
  .action(async (sourceDir) => {
    clear()
    console.log('')
    
    const uabpress = await figletAsync('uabpress')
    chalkAnimation.pulse(uabpress).start()

    const port = sourceDir.port || 3000
    wrapCommand({
      port,
      theme: options.theme || 'default',
      sourceDir: path.resolve(sourceDir.args.length > 0 ? sourceDir.args[0] : '.')
    })

    await open(`http://localhost: ${port}`)
    console.log(' Dev server running at:')
    console.log('')
    console.log(` > Local: ${chalk.cyan(`http://localhost: ${port}`)}`)
    console.log('')
  })
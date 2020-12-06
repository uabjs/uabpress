const fs = require('fs')
const path = require('path')
const assetsPath = '../../../assets/'

const {
  Provider,
  FileNode,
  resolvePath,
  testFile,
  options,
  next } = require('../../provider/__test_files__')
const themeMiddleware = require('../index')

it('themes 单文件', async () => {
  const fileNode = new FileNode(testFile, options)
  await themeMiddleware({
    fileNode
  }, next)
  expect(fileNode.themes[0].name).toBe('默认样式')
  expect(fileNode.getTheme('默认样式').name).toBe('默认样式')
  expect(fileNode.getTheme('不存在的样式').file).toBe('mark')
  expect(fileNode.getTheme('默认样式').css)
    .toBe(fs.readFileSync(path.join(__dirname, assetsPath, 'themes/mark/style.css'), {
      encoding: 'utf-8'
    }))
})

it('themes middleware', async () => {
  const provider = new Provider()
  provider.resolvePath = resolvePath
  provider.useMiddleware(themeMiddleware)

  await provider.patch([testFile])
  const fileNode = provider.nodes[testFile]

  expect(fileNode.themes[0].name).toBe('默认样式')
  expect(fileNode.getTheme('默认样式').name).toBe('默认样式')
  expect(fileNode.getTheme('不存在的样式').file).toBe('mark')
  expect(fileNode.getTheme('默认样式').css)
    .toBe(fs.readFileSync(path.join(__dirname, assetsPath, 'themes/mark/style.css'), {
      encoding: 'utf-8'
    }))

})
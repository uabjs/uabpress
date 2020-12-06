const Provider = require('./Provider')

module.exports = function () {
  const provider = new Provider()
  Array.from([
    require('./middleware/title'),       // 解析标题
    require('./middleware/prefix'),      // 标题层级
    require('./middleware/breadcrumb'),  // 计算面包屑
    require('./middleware/autoNumber'),  // 自动生成序号
    require('./middleware/marked'),      // markdown转html
    require('./middleware/themes')       // 添加样式
  ]).forEach(middleware => {
    provider.useMiddleware(middleware)
  })
  return provider
}

/**
 * root: TreeNode { path:'', children:[], parent: [TreeNode] },
 * nodes 内有两种形式： 标题集， 文件集
 * nodes: {
 *  '标题集/?': {
 *    path: 'level1B/levelB',
      children: [ [FileNode], ... ],
      parent: TreeNode { path: 'level1B', children: [Array], parent: [TreeNode] }
 *  }
 *  '标题集/文件集.md': FileNode {
      resolvePath: [Function],
      path: '文件集.md',
      isFileNode: true,
      parent: [TreeNode],
      body: '11111111111',
      lastModified: 1606828666908,
      title: '文件集.md',
      prefix: '',
      breadcrumb: [Object],
      catalogs: [],
      html: '<p>11111111111</p>\n'+ ...<h1~3>,
      themes: [Array],
      getTheme: [Function]
    },
    ...
   },
   middlewares: [],
   resolvePath: fn
 */

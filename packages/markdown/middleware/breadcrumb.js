/**
 * 解析面包屑 html
 */

const indexFiles = [ 'README.md', 'index.html' ]

module.exports = async ({ fileNode }, next) => {
  const breadcrumb = fileNode.breadcrumb = {
    nodes: [ fileNode ], //面包屑排版
    toHtml: toHtml,
    get html() {
      return this.toHtml()
    }
  }
  let parentNode = fileNode.parent
  while (parentNode) {
    breadcrumb.nodes.unshift(parentNode)
    parentNode = parentNode.parent
  }
  if (fileNode.path.indexOf('README.md') !== -1) {
    breadcrumb.nodes.pop()
  }
  await next()
}

// 面包屑 html
function toHtml(formatNode, separator) {
  const formatFunc = formatNode || formatDefault
  return this.nodes.map(treeNode => {
    return formatFunc(
      treeNode.isFileNode ? null : treeNode,
      treeNode.isFileNode ? treeNode
      : treeNode.children.length > 0 && indexFiles.indexOf(treeNode.getFileName(treeNode.children[0])) != -1 ? treeNode.children[0]
        : null
    )
  }).join(separator || '')
}

function formatDefault(treeNode, indexFileNode) {
  let itemHtml = ''
  if (indexFileNode) {
    let path = indexFileNode.path
    indexFiles.forEach(item => {
      path = path.replace(item, '')
    })
    // 标题 || 文件名
    itemHtml = `<a href="/${path}">${indexFileNode.title || indexFileNode.path}</a>`
  } else {
    // 文件名
    itemHtml = treeNode.path
  }
  return `<li class="breadcrumb-item">${itemHtml}</li>`
}
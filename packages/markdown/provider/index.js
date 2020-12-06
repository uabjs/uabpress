const path = require('path')
const FileNode = require('./FileNode')
const TreeNode = require('./TreeNode')

class Provider {
  constructor() {
    this.root = new TreeNode()
    this.nodes = { [this.treekey()]: this.root }
    this.middlewares = []
    this.resolvePath = (filePath) => path.join(__dirname, filePath)
  }

  // 区别 文件夹 与 md 文件
  treekey(path) {
    return `${path ? path : ''}/?`
  }

  // 斜杠转译
  formatFilePath(filePath) {
    return filePath.replace(/(\\\\*|\/\/*)/g, '\/').replace(/^\//, '')
  }

  /**
   * 
   * @param {array} filePaths : [ 'README.md', 'one/README.md', ... ]
   */
  async patch(filePaths) {
    const treeFlags = this.treekey()
    const newFiles = {}
    filePaths.forEach(filePath => {
      newFiles[this.formatFilePath(filePath)] = null
    })
    Object.keys(this.nodes)
      .filter(filePaths => filePaths.indexOf(treeFlags) === -1)
      .forEach(async (filePath) => {
        if (filePath in newFiles) {
          await this.updateFile(filePath)
          delete newFiles[filePath]
        } else {
          await this.removeFile(filePath)
        }
      })

    //剩下的 newFiles 则是新增的文件
    Object.keys(newFiles).forEach(async (filePath) => {
      await this.addFile(filePath)
    })
  }

  async removeFile(filePath) {
    if (filePath in this.nodes) {
      const fileNode = this.nodes[filePath]
      fileNode.parent.removeFile(fileNode)
      delete this.nodes[filePath]
    }
  }

  async updateFile(filePath) {
    const fileNode = this.nodes[filePath]
    if (fileNode.hasChanged) {
      await this.applyMiddleware(fileNode, 'update')
    }
  }

  // 添加文件节点 没有父级先添加父级
  async addFile(_filePath) {
    const filePath = this.formatFilePath(_filePath)
    if (!(filePath in this.nodes)) {
      const fileNode = this.nodes[filePath] = new FileNode(filePath, { resolvePath: this.resolvePath })
      this.getParent(filePath).addChild(fileNode)
      await this.applyMiddleware(fileNode, 'add')
    }
  }

  getParent(filePath) {
    const filePaths = this.formatFilePath(filePath).split(/\//)
    filePaths.pop()                        // 去文件名
    const parentPath = filePaths.join('/')
    const parentPathKey = this.treekey(parentPath)
    if (!(parentPathKey in this.nodes)) { // 没有父级 递归创建
      this.nodes[parentPathKey] = this.getParent(parentPath).addChild(new TreeNode(parentPath))
    }
    return this.nodes[parentPathKey]
  }

  async applyMiddleware(fileNode) {
    fileNode.init()
    const _middleware = [ ...this.middlewares ]
    const next = async () => {
      if (_middleware.length > 0) {
        return await _middleware.shift()({ fileNode, provider: this }, next)
      }
    }
    return await next()
  }

  useMiddleware(middleware) {
    this.middlewares.push(middleware)
  }

  // 解析菜单 menu
  toArray(formatNodeCb, parentNode) {
    const result = []
    const _nodes = parentNode || this.root
    _nodes.children.forEach(childNode => {
      if (childNode.isFileNode) {
        result.push(formatNodeCb(childNode))
      } else if (childNode.children && childNode.children.length > 0) {
        this.toArray(formatNodeCb, childNode).forEach(item => result.push(item))
      }
    })
    return result
  }

  // 提取该路径树
  getItem(reqFile, formatNode) {
    const filePath = this.formatFilePath(reqFile)
    return formatNode(filePath in this.nodes ? this.nodes[filePath] : null)
  }
}

module.exports = Provider

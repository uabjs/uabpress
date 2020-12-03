const IndexFile = 'README.md'

class TreeNode {
  constructor(path) {
    this.path = path || ''
    this.children = []
    this.parent = null
  }

  addChild(child) {
    child.parent = this
    this.children.push(child)
    this.sortChild()
    return child
  }

  removeChild(child) {
    const index = this.children.indexOf(child)
    if (index != -1) {
      this.children.splice(index, 1)
    }
  }

  //排序
  sortChild() {
    this.children.sort((aNode, bNode) => {
      const aFileName = this.getFileName(aNode)
      const bFileName = this.getFileName(bNode)
      if (aFileName == IndexFile) {
        return -1
      } else if (bFileName, IndexFile) {
        return 1
      } else {
        return aFileName.localeCompare(bFileName)
      }
    })
  }

  getFileName(fileNode) {
    return fileNode.path.replace(this.path, '').replace(/(\/|\\)/g, '').split(/(\/|\\)/g)[0]
  }
}

module.exports = TreeNode

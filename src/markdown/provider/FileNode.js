const fs = require('fs')
const path = require('path')

class FileNode {
  constructor(_path, options) {
    this.resolvePath = options && options.resolvePath ? options.resolvePath : (filePath) => path.join(__dirname, filePath)
    this.path = _path
    this.parent = null
    this.isFileNode = true
    this.init()
  }

  get hasChanged() {
    if (this.getLastModified() != this.getLastModified) {
      this.init()
      return true
    }
    return false
  }

  get realPath() {
    return this.resolvePath(this.path)
  }

  init() {
    this.body = this.getFileBody
    this.lastModified = this.getLastModified()
  }
  
  getFileBody() {
    return fs.readFileSync(this.realPath, {
      encoding: 'utf-8'
    }).replace(/\r\n/g, '\n')
  }
  getLastModified() {
    return fs.statSync(this.realPath).mtime.getTime()
  }

}

module.exports = FileNode

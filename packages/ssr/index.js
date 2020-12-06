const fs = require('fs')
const path = require('path')
const Vue = require('vue')
const compilerSsr = require('@vue/compiler-ssr')
const compilerSfc = require('@vue/compiler-sfc')
const serverRenderer = require('@vue/server-renderer')


const createRender = sfcPath => {
  sfcPath = sfcPath ? sfcPath : path.resolve(__dirname, '../template/App.vue')
  const { descriptor } = compilerSfc.parse(fs.readFileSync(sfcPath, 'utf-8'))
  const render = compilerSsr.compile(descriptor.template.content).code
  return async (data) => {
    const app = Vue.createApp({
      ssrRender: new Function('require', render)(require),
      data: () => data
    })
    return serverRenderer.renderToString(app)
  }
}

const renderMarkdown = async ({ reqFile, template, provider, options }) => {
  const skin = options.theme || '默认皮肤'
  // 获取 menu 菜单数据及其页面数据
  const data = {
    menu: provider.toArray(fileNode => ({
      path: fileNode.path,
      name: fileNode.title,
      prefix: fileNode.prefix || ''
    })),
    skinPath: '',
    breadcrumb: null,
    catalogs: [],
    markdown: ''
  }

  //解析该路径页面的 data 数据
  await provider.getItem(reqFile, fileNode => {
    if (!fileNode) {
      data.markdown = `<h3>${reqFile} 不存在<h3>`
    } else {
      // console.log("fileNode----", fileNode);
      data.breadcrumb = fileNode.breadcrumb.html
      data.catalogs = fileNode.catalogs
      data.skinPath = fileNode.getTheme(skin).path
      data.markdown = [
        fileNode.html
      ].join('')
    }
  })
  return await createRender(template)(data)
}

module.exports = {
  createRender,
  renderMarkdown
}

// import info from '../package.json'
import WordEditor from './WordEditor/index.js'


const components = [
  WordEditor
]

const install = Vue => {
  components.forEach(item => {
    Vue.component(item.name, item)
  });
}

//引用文件方式时，会使用，类似jquery方式引入
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

//按需导出
export default {
  // name: info.name,
  // author: info.author,
  // version: info.version,
  // description: info.description,
  install,
  WordEditor
}

//完整导出
// export default {
//   name: info.name,
//   author: info.author,
//   version: info.version,
//   description: info.description,
//   install,
//   action,
//   actionItem
// }

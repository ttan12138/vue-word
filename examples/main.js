import { createApp } from 'vue'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/display.css'
import App from './App.vue'
// import ElementPlus from 'element-plus'
import WordEditor from '../packages/index.js';
createApp(App).use(WordEditor).mount('#app')


/*
 * LS8 - Love Son Platform
 * 前端应用入口文件
 * 负责初始化Vue应用实例、注册插件和全局组件
 */
import { createApp } from 'vue'
import './style.css' // 全局样式
import App from './App.vue' // 根组件
import router from './router' // 路由配置
import { createPinia } from 'pinia' // 状态管理
import { useErrorHandler } from '@/services/errorHandler' // 错误处理服务

// 导入Font Awesome图标库
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 导入需要的图标
import { faVideo, faComment, faShareSquare, faChevronRight, faGamepad, faChess, faChessBoard, faChessPawn, faChessKnight } from '@fortawesome/free-solid-svg-icons';
import { faWeixin } from '@fortawesome/free-brands-svg-icons';

// 添加图标到库
library.add(
  faVideo,       // 视频图标
  faComment,     // 评论图标
  faShareSquare, // 分享图标
  faChevronRight, // 右箭头图标
  faGamepad,     // 游戏手柄图标
  faChess,       // 象棋图标
  faChessBoard,  // 棋盘图标
  faChessPawn,   // 棋子图标
  faChessKnight, // 骑士图标
  faWeixin       // 微信图标（用于分享）
)

// 创建应用实例
const app = createApp(App)

// 注册Font Awesome图标组件
app.component('FontAwesomeIcon', FontAwesomeIcon)

// 初始化错误处理
const errorHandler = useErrorHandler()
app.config.errorHandler = (err, instance, info) => {
  errorHandler.handleError(err, instance, info)
}
window.addEventListener('error', (event) => {
  errorHandler.handleWindowError(event)
})
window.addEventListener('unhandledrejection', (event) => {
  errorHandler.handlePromiseRejection(event)
})

// 安装插件
app.use(createPinia())
app.use(router)

// 性能优化: 延迟挂载以确保所有资源加载完成
window.addEventListener('DOMContentLoaded', () => {
  app.mount('#app')
})

// 导出app实例供测试和调试使用
export default app

// 错误处理服务
import { ref } from 'vue'

export class ErrorHandler {
  constructor() {
    this.errors = ref([])
    this.isProduction = import.meta.env.PROD
  }

  /**
   * 处理Vue组件错误
   * @param {Error} err - 错误对象
   * @param {VueComponent} instance - Vue组件实例
   * @param {string} info - 错误信息
   */
  handleError(err, instance, info) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: err.message,
      stack: err.stack,
      component: instance?.$options?.name || 'Unknown',
      info
    }

    this.errors.value.push(errorInfo)

    // 在开发环境下打印详细错误
    if (!this.isProduction) {
      console.error('Vue Component Error:', errorInfo)
    } else {
      // 在生产环境下发送错误到监控服务
      this.sendErrorToService(errorInfo)
    }
  }

  /**
   * 处理窗口错误
   * @param {ErrorEvent} event - 错误事件
   */
  handleWindowError(event) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: event.error?.message || event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }

    this.errors.value.push(errorInfo)

    if (!this.isProduction) {
      console.error('Window Error:', errorInfo)
    } else {
      this.sendErrorToService(errorInfo)
    }
  }

  /**
   * 处理未捕获的Promise拒绝
   * @param {PromiseRejectionEvent} event - Promise拒绝事件
   */
  handlePromiseRejection(event) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      reason: event.reason
    }

    this.errors.value.push(errorInfo)

    if (!this.isProduction) {
      console.error('Unhandled Promise Rejection:', errorInfo)
    } else {
      this.sendErrorToService(errorInfo)
    }
  }

  /**
   * 发送错误到监控服务
   * @param {Object} errorInfo - 错误信息对象
   */
  sendErrorToService(errorInfo) {
    // 生产环境下可以实现错误上报
    // 例如使用fetch或axios发送到后端错误监控服务
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorInfo)
      })
    } catch (err) {
      console.error('Failed to send error to service:', err)
    }
  }

  /**
   * 清除错误历史
   */
  clearErrors() {
    this.errors.value = []
  }
}

// 创建并导出错误处理器实例
export const useErrorHandler = () => new ErrorHandler()
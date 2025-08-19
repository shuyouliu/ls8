import Peer from 'peerjs'
import { useErrorHandler } from './errorHandler'

export class PeerService {
  constructor() {
    this.peer = null
    this.connection = null
    this.connections = new Map() // 存储所有连接
    this.mediaConnections = new Map() // 存储媒体连接
    this.errorHandler = useErrorHandler()
    this.isConnected = false
    this.reconnectionAttempts = 0
    this.maxReconnectionAttempts = 5
    this.reconnectionDelay = 2000
  }

  /**
   * 初始化Peer连接
   * @param {Object} options - 配置选项
   * @returns {Promise<string>} - 返回Peer ID
   */
  init(options = {}) {
    const defaultOptions = {
      host: import.meta.env.VITE_PEERJS_HOST || 'ls8.top',
      path: import.meta.env.VITE_PEERJS_PATH || '/peerjs-server',
      port: import.meta.env.VITE_PEERJS_PORT || 80,
      secure: import.meta.env.VITE_PEERJS_SECURE === 'true',
      debug: import.meta.env.DEV ? 3 : 0,
      config: {
        iceServers: [
          {
            urls: 'stun:stun.aliyun.com:3478'
          },
          {
            urls: 'turn:turn.aliyun.com:3478',
            username: 'ls8',
            credential: 'ls8turnserver'
          }
        ]
      }
    }

    const mergedOptions = { ...defaultOptions, ...options }

    this.peer = new Peer(undefined, mergedOptions)

    this.setupEventListeners()

    return new Promise((resolve, reject) => {
      this.peer.on('open', (id) => {
        this.isConnected = true
        resolve(id)
      })

      this.peer.on('error', (error) => {
        this.errorHandler.handleError(error, null, 'Peer initialization error')
        reject(error)
      })
    })
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听连接事件
    this.peer.on('connection', (conn) => {
      this.connection = conn
      this.connections.set(conn.peer, conn)

      // 设置连接事件
      this.setupConnectionEvents(conn)
    })

    // 监听断开连接事件
    this.peer.on('disconnected', () => {
      this.isConnected = false
      console.warn('Peer disconnected. Attempting to reconnect...')
      this.reconnect()
    })

    // 监听关闭事件
    this.peer.on('close', () => {
      this.isConnected = false
      console.warn('Peer connection closed')
    })

    // 监听错误事件
    this.peer.on('error', (error) => {
      this.errorHandler.handleError(error, null, 'Peer error')
      console.error('Peer error:', error)
    })
  }

  /**
   * 设置连接事件
   * @param {Peer.DataConnection} conn - 数据连接对象
   */
  setupConnectionEvents(conn) {
    conn.on('open', () => {
      console.log(`Connected to peer: ${conn.peer}`)
    })

    conn.on('data', (data) => {
      console.log('Received data:', data)
    })

    conn.on('close', () => {
      console.log(`Connection closed with peer: ${conn.peer}`)
      this.connections.delete(conn.peer)
      if (this.connection === conn) {
        this.connection = null
      }
    })

    conn.on('error', (error) => {
      this.errorHandler.handleError(error, null, `Connection error with peer: ${conn.peer}`)
      console.error(`Connection error with peer ${conn.peer}:`, error)
    })
  }

  /**
   * 连接到远程Peer
   * @param {string} peerId - 远程Peer ID
   * @param {Object} metadata - 元数据
   * @returns {Promise<Peer.DataConnection>} - 返回数据连接对象
   */
  connect(peerId, metadata = {}) {
    if (!this.peer) {
      return Promise.reject(new Error('Peer not initialized'))
    }

    // 检查是否已有连接
    if (this.connections.has(peerId)) {
      const existingConn = this.connections.get(peerId)
      if (existingConn.open) {
        this.connection = existingConn
        return Promise.resolve(existingConn)
      } else {
        this.connections.delete(peerId)
      }
    }

    const conn = this.peer.connect(peerId, {
      metadata,
      serialization: 'json'
    })

    this.connections.set(peerId, conn)
    this.connection = conn

    this.setupConnectionEvents(conn)

    return new Promise((resolve, reject) => {
      conn.on('open', () => resolve(conn))
      conn.on('error', (error) => reject(error))
    })
  }

  /**
   * 发送数据
   * @param {any} data - 要发送的数据
   * @param {string} [peerId] - 目标Peer ID，如果不指定则发送给当前连接
   * @returns {boolean} - 是否发送成功
   */
  send(data, peerId) {
    try {
      let conn
      if (peerId) {
        conn = this.connections.get(peerId)
      } else {
        conn = this.connection
      }

      if (!conn || !conn.open) {
        console.error('No open connection to send data')
        return false
      }

      conn.send(data)
      return true
    } catch (error) {
      this.errorHandler.handleError(error, null, 'Error sending data')
      console.error('Error sending data:', error)
      return false
    }
  }

  /**
   * 发起视频通话
   * @param {string} peerId - 远程Peer ID
   * @param {MediaStream} stream - 本地媒体流
   * @returns {Promise<Peer.MediaConnection>} - 返回媒体连接对象
   */
  call(peerId, stream) {
    if (!this.peer) {
      return Promise.reject(new Error('Peer not initialized'))
    }

    const call = this.peer.call(peerId, stream)
    this.mediaConnections.set(peerId, call)

    call.on('stream', (remoteStream) => {
      console.log(`Received remote stream from ${peerId}`)
    })

    call.on('close', () => {
      console.log(`Media connection closed with ${peerId}`)
      this.mediaConnections.delete(peerId)
    })

    call.on('error', (error) => {
      this.errorHandler.handleError(error, null, `Media call error with ${peerId}`)
      console.error(`Media call error with ${peerId}:`, error)
      this.mediaConnections.delete(peerId)
    })

    return new Promise((resolve, reject) => {
      call.on('stream', (remoteStream) => {
        resolve({
          call,
          remoteStream
        })
      })
      call.on('error', (error) => reject(error))
    })
  }

  /**
   * 处理来电
   * @param {Function} callback - 回调函数，接收远程流和通话对象
   */
  onCall(callback) {
    if (!this.peer) {
      throw new Error('Peer not initialized')
    }

    this.peer.on('call', (call) => {
      this.mediaConnections.set(call.peer, call)

      call.on('stream', (remoteStream) => {
        callback(remoteStream, call)
      })

      call.on('close', () => {
        console.log(`Incoming call closed with ${call.peer}`)
        this.mediaConnections.delete(call.peer)
      })

      call.on('error', (error) => {
        this.errorHandler.handleError(error, null, `Incoming call error with ${call.peer}`)
        console.error(`Incoming call error with ${call.peer}:`, error)
        this.mediaConnections.delete(call.peer)
      })
    })
  }

  /**
   * 重新连接
   */
  reconnect() {
    if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectionAttempts++
    console.log(`Reconnection attempt ${this.reconnectionAttempts}...`)

    setTimeout(() => {
      this.peer.reconnect()
    }, this.reconnectionDelay * this.reconnectionAttempts)
  }

  /**
   * 断开所有连接并销毁Peer实例
   */
  destroy() {
    if (this.peer) {
      // 关闭所有数据连接
      this.connections.forEach((conn) => {
        if (conn.open) {
          conn.close()
        }
      })
      this.connections.clear()
      this.connection = null

      // 关闭所有媒体连接
      this.mediaConnections.forEach((call) => {
        call.close()
      })
      this.mediaConnections.clear()

      // 销毁Peer实例
      this.peer.destroy()
      this.peer = null
      this.isConnected = false
      this.reconnectionAttempts = 0
    }
  }
}

export default new PeerService()
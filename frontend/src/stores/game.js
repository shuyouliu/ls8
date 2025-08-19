import { defineStore } from 'pinia'
import peerService from '@/services/peer'

// 游戏配置
const GAME_CONFIG = {
  chess: {
    boardSize: 10,
    initialPieces: [
      // 黑方棋子
      { x: 0, y: 0, type: 'rook', color: 'black' },
      { x: 1, y: 0, type: 'horse', color: 'black' },
      { x: 2, y: 0, type: 'elephant', color: 'black' },
      { x: 3, y: 0, type: 'advisor', color: 'black' },
      { x: 4, y: 0, type: 'king', color: 'black' },
      { x: 5, y: 0, type: 'advisor', color: 'black' },
      { x: 6, y: 0, type: 'elephant', color: 'black' },
      { x: 7, y: 0, type: 'horse', color: 'black' },
      { x: 8, y: 0, type: 'rook', color: 'black' },
      { x: 1, y: 2, type: 'cannon', color: 'black' },
      { x: 7, y: 2, type: 'cannon', color: 'black' },
      { x: 0, y: 3, type: 'pawn', color: 'black' },
      { x: 2, y: 3, type: 'pawn', color: 'black' },
      { x: 4, y: 3, type: 'pawn', color: 'black' },
      { x: 6, y: 3, type: 'pawn', color: 'black' },
      { x: 8, y: 3, type: 'pawn', color: 'black' },
      // 白方棋子
      { x: 0, y: 9, type: 'rook', color: 'white' },
      { x: 1, y: 9, type: 'horse', color: 'white' },
      { x: 2, y: 9, type: 'elephant', color: 'white' },
      { x: 3, y: 9, type: 'advisor', color: 'white' },
      { x: 4, y: 9, type: 'king', color: 'white' },
      { x: 5, y: 9, type: 'advisor', color: 'white' },
      { x: 6, y: 9, type: 'elephant', color: 'white' },
      { x: 7, y: 9, type: 'horse', color: 'white' },
      { x: 8, y: 9, type: 'rook', color: 'white' },
      { x: 1, y: 7, type: 'cannon', color: 'white' },
      { x: 7, y: 7, type: 'cannon', color: 'white' },
      { x: 0, y: 6, type: 'pawn', color: 'white' },
      { x: 2, y: 6, type: 'pawn', color: 'white' },
      { x: 4, y: 6, type: 'pawn', color: 'white' },
      { x: 6, y: 6, type: 'pawn', color: 'white' },
      { x: 8, y: 6, type: 'pawn', color: 'white' },
    ]
  },
  go: {
    boardSize: 19,
    initialPieces: []
  }
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameType: 'chess',
    pieces: [],
    currentPlayer: 'black',
    isMyTurn: true,
    gameStatus: 'waiting', // waiting, playing, finished, paused
    winner: null,
    roomId: null,
    playerRole: null, // black or white
    lastMove: null,
    moveHistory: [],
    timeRemaining: {
      black: 600, // 10 minutes
      white: 600
    },
    timerInterval: null,
    roomSettings: {
      allowSpectators: true,
      publicRoom: false,
      timeControl: 600 // 10 minutes
    },
    spectators: [],
    isRoomOwner: false,
    spectateMode: false,
    spectateName: ''
  }),

  getters: {
    isGameActive: (state) => state.gameStatus === 'playing',
    currentPlayerTime: (state) => state.timeRemaining[state.currentPlayer],
    canMove: (state) => state.isGameActive && state.isMyTurn && !state.spectateMode,
    boardSize: (state) => GAME_CONFIG[state.gameType]?.boardSize || 10,
    isGameOver: (state) => state.gameStatus === 'finished',
    opponentColor: (state) => state.playerRole === 'black' ? 'white' : 'black',
    gameConfig: (state) => GAME_CONFIG[state.gameType] || GAME_CONFIG.chess
  },

  actions: {
    /**
     * 开始游戏
     * @param {string} roomId - 房间ID
     * @param {string} playerRole - 玩家角色 (black 或 white)
     * @param {boolean} isOwner - 是否为房间所有者
     */
    startGame(roomId, playerRole, isOwner = false) {
      this.roomId = roomId
      this.playerRole = playerRole
      this.isRoomOwner = isOwner
      this.gameStatus = 'playing'
      this.isMyTurn = playerRole === 'black'
      this.pieces = [...this.gameConfig.initialPieces]
      this.moveHistory = []
      this.startTimer()

      // 发送游戏开始事件到对手
      if (!this.spectateMode) {
        peerService.send({
          type: 'GAME_START',
          roomId,
          playerRole
        })
      }
    },

    /**
     * 放置棋子
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {string} [pieceType] - 棋子类型 (仅用于围棋)
     * @returns {boolean} - 是否放置成功
     */
    placePiece(x, y, pieceType = null) {
      if (!this.canMove || !this.isValidMove(x, y)) return false

      const piece = {
        x,
        y,
        color: this.currentPlayer,
        type: pieceType || this.determinePieceType(x, y)
      }

      this.pieces.push(piece)
      this.lastMove = { x, y, piece }

      // 记录移动历史
      this.moveHistory.push({
        x,
        y,
        color: this.currentPlayer,
        timestamp: Date.now()
      })

      // 检查游戏是否结束
      this.checkGameEnd()

      // 发送移动到对手
      peerService.send({
        type: 'MOVE',
        x,
        y,
        pieceType
      })

      // 切换玩家
      this.switchPlayer()

      return true
    },

    /**
     * 接收对手的棋子
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {string} [pieceType] - 棋子类型
     */
    receivePiece(x, y, pieceType = null) {
      if (this.isMyTurn || this.spectateMode) return

      const piece = {
        x,
        y,
        color: this.currentPlayer,
        type: pieceType || this.determinePieceType(x, y)
      }

      this.pieces.push(piece)
      this.lastMove = { x, y, piece }

      // 记录移动历史
      this.moveHistory.push({
        x,
        y,
        color: this.currentPlayer,
        timestamp: Date.now()
      })

      // 检查游戏是否结束
      this.checkGameEnd()

      // 切换玩家
      this.switchPlayer()
    },

    /**
     * 确定棋子类型
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {string} - 棋子类型
     */
    determinePieceType(x, y) {
      if (this.gameType === 'go') {
        return 'stone'
      }

      // 象棋根据位置确定棋子类型
      const initialPiece = this.gameConfig.initialPieces.find(
        p => p.x === x && p.y === y
      )

      return initialPiece ? initialPiece.type : 'pawn'
    },

    /**
     * 检查移动是否有效
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {boolean} - 是否有效
     */
    isValidMove(x, y) {
      // 检查坐标是否在棋盘范围内
      if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
        return false
      }

      // 检查是否已有棋子
      const hasPiece = this.pieces.some(p => p.x === x && p.y === y)
      if (hasPiece) return false

      if (this.gameType === 'go') {
        return this.isValidGoMove(x, y)
      }
      return this.isValidChessMove(x, y)
    },

    /**
     * 检查象棋移动是否有效
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {boolean} - 是否有效
     */
    isValidChessMove(x, y) {
      // TODO: 实现象棋规则
      // 简化版：允许任何空位置的移动
      return true
    },

    /**
     * 检查围棋移动是否有效
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {boolean} - 是否有效
     */
    isValidGoMove(x, y) {
      // TODO: 实现围棋规则
      // 简化版：允许任何空位置的移动
      return true
    },

    /**
     * 切换当前玩家
     */
    switchPlayer() {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'
      this.isMyTurn = this.currentPlayer === this.playerRole

      // 重置当前玩家的计时器
      if (this.isMyTurn) {
        this.resetPlayerTimer()
      }
    },

    /**
     * 检查游戏是否结束
     */
    checkGameEnd() {
      // 简化版：检查是否有玩家时间用完
      if (this.timeRemaining.black <= 0) {
        this.gameStatus = 'finished'
        this.winner = 'white'
        this.stopTimer()
        return
      }

      if (this.timeRemaining.white <= 0) {
        this.gameStatus = 'finished'
        this.winner = 'black'
        this.stopTimer()
        return
      }

      // TODO: 实现更复杂的胜负判定逻辑
      if (this.isWinningMove()) {
        this.gameStatus = 'finished'
        this.winner = this.currentPlayer
        this.stopTimer()
      }
    },

    /**
     * 检查是否为制胜一招
     * @returns {boolean} - 是否为制胜一招
     */
    isWinningMove() {
      // TODO: 实现胜负判定逻辑
      return false
    },

    /**
     * 投降
     */
    surrender() {
      this.gameStatus = 'finished'
      this.winner = this.currentPlayer === 'black' ? 'white' : 'black'
      this.stopTimer()

      // 发送投降信息到对手
      peerService.send({
        type: 'SURRENDER',
        winner: this.winner
      })
    },

    /**
     * 请求和棋
     */
    requestDraw() {
      // 发送求和请求到对手
      peerService.send({
        type: 'DRAW_REQUEST'
      })
    },

    /**
     * 接受和棋
     */
    acceptDraw() {
      this.gameStatus = 'finished'
      this.winner = null
      this.stopTimer()

      // 发送接受和棋信息到对手
      peerService.send({
        type: 'DRAW_ACCEPTED'
      })
    },

    /**
     * 拒绝和棋
     */
    rejectDraw() {
      // 发送拒绝和棋信息到对手
      peerService.send({
        type: 'DRAW_REJECTED'
      })
    },

    /**
     * 重置游戏
     */
    resetGame() {
      this.pieces = [...this.gameConfig.initialPieces]
      this.currentPlayer = 'black'
      this.isMyTurn = this.playerRole === 'black'
      this.gameStatus = 'playing'
      this.winner = null
      this.lastMove = null
      this.moveHistory = []
      this.timeRemaining = {
        black: this.roomSettings.timeControl,
        white: this.roomSettings.timeControl
      }

      // 重启计时器
      this.stopTimer()
      this.startTimer()

      // 发送游戏重置信息到对手
      peerService.send({
        type: 'GAME_RESET'
      })
    },

    /**
     * 开始计时器
     */
    startTimer() {
      if (this.timerInterval) return

      this.timerInterval = setInterval(() => {
        if (this.isMyTurn && this.isGameActive) {
          this.timeRemaining[this.playerRole]--

          // 检查时间是否用完
          if (this.timeRemaining[this.playerRole] <= 0) {
            this.checkGameEnd()
          }
        }
      }, 1000)
    },

    /**
     * 停止计时器
     */
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    /**
     * 重置当前玩家的计时器
     */
    resetPlayerTimer() {
      // 简化版：不重置计时器，实际应用中可能需要根据游戏规则调整
    },

    /**
     * 更新房间设置
     * @param {Object} settings - 房间设置
     */
    updateRoomSettings(settings) {
      this.roomSettings = { ...this.roomSettings, ...settings }

      // 发送设置更新到对手和观众
      peerService.send({
        type: 'ROOM_SETTINGS_UPDATE',
        settings: this.roomSettings
      })
    },

    /**
     * 加入观战模式
     * @param {string} roomId - 房间ID
     * @param {string} name - 观战者名称
     */
    joinSpectate(roomId, name) {
      this.roomId = roomId
      this.spectateMode = true
      this.spectateName = name
      this.gameStatus = 'playing'

      // 发送观战加入信息
      peerService.send({
        type: 'SPECTATOR_JOIN',
        name
      })
    },

    /**
     * 退出观战模式
     */
    leaveSpectate() {
      // 发送观战离开信息
      peerService.send({
        type: 'SPECTATOR_LEAVE',
        name: this.spectateName
      })

      this.spectateMode = false
      this.spectateName = ''
      this.gameStatus = 'waiting'
      this.pieces = []
      this.moveHistory = []
    },

    /**
     * 处理来自Peer的消息
     * @param {Object} data - 消息数据
     */
    handlePeerData(data) {
      switch (data.type) {
        case 'MOVE':
          this.receivePiece(data.x, data.y, data.pieceType)
          break
        case 'GAME_END':
          this.gameStatus = 'finished'
          this.winner = data.winner
          this.stopTimer()
          break
        case 'SURRENDER':
          this.gameStatus = 'finished'
          this.winner = data.winner
          this.stopTimer()
          break
        case 'DRAW_REQUEST':
          // 显示求和请求
          break
        case 'DRAW_ACCEPTED':
          this.gameStatus = 'finished'
          this.winner = null
          this.stopTimer()
          break
        case 'DRAW_REJECTED':
          // 显示求和被拒绝
          break
        case 'GAME_RESET':
          this.resetGame()
          break
        case 'ROOM_SETTINGS_UPDATE':
          this.roomSettings = { ...this.roomSettings, ...data.settings }
          break
        case 'SPECTATOR_JOIN':
          this.spectators.push(data.name)
          break
        case 'SPECTATOR_LEAVE':
          this.spectators = this.spectators.filter(name => name !== data.name)
          break
      }
    },

    /**
     * 发送聊天消息
     * @param {string} message - 消息内容
     */
    sendChatMessage(message) {
      peerService.send({
        type: 'CHAT_MESSAGE',
        content: message,
        sender: this.playerRole
      })
    },

    /**
     * 获取Peer连接
     * @returns {PeerService} - Peer服务实例
     */
    getPeerConnection() {
      return peerService
    }
  }
})
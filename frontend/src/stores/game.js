import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameType: 'chess',
    pieces: [],
    currentPlayer: 'black',
    isMyTurn: true,
    gameStatus: 'waiting', // waiting, playing, finished
    winner: null,
    roomId: null,
    playerRole: null, // black or white
    lastMove: null,
    timeRemaining: {
      black: 600, // 10 minutes
      white: 600
    }
  }),

  getters: {
    isGameActive: (state) => state.gameStatus === 'playing',
    currentPlayerTime: (state) => state.timeRemaining[state.currentPlayer],
    canMove: (state) => state.isGameActive && state.isMyTurn
  },

  actions: {
    startGame(roomId, playerRole) {
      this.roomId = roomId
      this.playerRole = playerRole
      this.gameStatus = 'playing'
      this.isMyTurn = playerRole === 'black'
    },

    placePiece(x, y) {
      if (!this.canMove || !this.isValidMove(x, y)) return false
      
      this.pieces.push({
        x,
        y,
        color: this.currentPlayer
      })
      
      this.lastMove = { x, y }
      this.checkGameEnd()
      this.switchPlayer()
      
      return true
    },

    receivePiece(x, y) {
      if (this.isMyTurn) return false

      this.pieces.push({
        x,
        y,
        color: this.currentPlayer
      })
      
      this.lastMove = { x, y }
      this.checkGameEnd()
      this.switchPlayer()
    },

    isValidMove(x, y) {
      // 检查是否已有棋子
      const hasPiece = this.pieces.some(p => p.x === x && p.y === y)
      if (hasPiece) return false

      if (this.gameType === 'go') {
        return this.isValidGoMove(x, y)
      }
      return this.isValidChessMove(x, y)
    },

    isValidGoMove(x, y) {
      // 围棋规则验证
      // TODO: 实现打劫规则和气的计算
      return true
    },

    isValidChessMove(x, y) {
      // 象棋规则验证
      // TODO: 实现各种棋子的走法规则
      return true
    },

    switchPlayer() {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'
      this.isMyTurn = !this.isMyTurn
    },

    checkGameEnd() {
      // TODO: 实现胜负判定
      if (this.isWinningMove()) {
        this.gameStatus = 'finished'
        this.winner = this.currentPlayer
      }
    },

    isWinningMove() {
      // TODO: 实现胜负判定逻辑
      return false
    },

    surrender() {
      this.gameStatus = 'finished'
      this.winner = this.currentPlayer === 'black' ? 'white' : 'black'
    },

    requestDraw() {
      // TODO: 实现求和逻辑
    },

    resetGame() {
      this.pieces = []
      this.currentPlayer = 'black'
      this.isMyTurn = this.playerRole === 'black'
      this.gameStatus = 'playing'
      this.winner = null
      this.lastMove = null
      this.timeRemaining = {
        black: 600,
        white: 600
      }
    }
  }
})
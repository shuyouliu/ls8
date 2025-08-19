<template>
  <!-- Add before Connection Status -->
  <div v-if="gameStatus === 'waiting'" class="mb-4">
    <div class="bg-blue-50 p-4 rounded-lg">
      <h3 class="text-lg font-bold mb-2">邀请对手</h3>
      <div class="flex items-center gap-2 mb-2">
        <input 
          ref="inviteLinkInput"
          type="text" 
          :value="inviteLink" 
          readonly
          class="flex-1 px-2 py-1 border rounded bg-white"
        >
        <button 
          @click="copyInviteLink" 
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          复制
        </button>
      </div>
      <div class="text-center">
        <QRCode :value="inviteLink" :size="150" level="M" />
      </div>
    </div>
  </div>

  <div class="p-4 bg-white rounded-lg shadow">
    <!-- Connection Status -->
    <div class="mb-4">
      <div class="text-sm" :class="{
        'text-green-600': connectionStatus === 'connected',
        'text-yellow-600': connectionStatus === 'connecting',
        'text-red-600': connectionStatus === 'disconnected'
      }">
        连接状态: {{ connectionStatus }}
      </div>
    </div>

    <!-- Video Chat Component -->
    <div class="mb-4">
      <VideoChat ref="videoChat" />
    </div>

    <!-- Game Status -->
    <div class="mb-4">
      <h3 class="text-lg font-bold mb-2">游戏状态</h3>
      <div class="text-sm" :class="{
        'text-green-600': gameStatus === 'playing',
        'text-yellow-600': gameStatus === 'waiting',
        'text-red-600': gameStatus === 'finished'
      }">
        <p>当前状态: {{ statusText }}</p>
        <p v-if="winner">获胜方: {{ winner === 'black' ? '黑方' : '白方' }}</p>
        <p>轮到: 
          <span :class="{ 'font-bold': isMyTurn }">
            {{ currentPlayer === 'black' ? '黑方' : '白方' }}
            {{ isMyTurn ? '(您的回合)' : '' }}
          </span>
        </p>
      </div>
    </div>

    <!-- Game Actions -->
    <div v-if="gameStatus === 'playing'" class="mb-4">
      <div v-if="drawRequested && !isDrawRequestor" class="bg-yellow-100 p-2 rounded mb-2">
        <p>对手请求和棋</p>
        <div class="flex gap-2 mt-2">
          <button @click="acceptDraw" class="px-3 py-1 bg-green-500 text-white rounded">
            接受
          </button>
          <button @click="rejectDraw" class="px-3 py-1 bg-red-500 text-white rounded">
            拒绝
          </button>
        </div>
      </div>
    </div>

    <!-- Last Move -->
    <div v-if="lastMove" class="mb-4">
      <h3 class="text-lg font-bold mb-2">最后一手</h3>
      <p class="text-sm bg-gray-100 p-2 rounded">
        坐标: {{ formatCoordinates(lastMove) }}
      </p>
    </div>

    <!-- Player Role -->
    <div class="mb-4">
      <h3 class="text-lg font-bold mb-2">您的角色</h3>
      <p class="text-sm" :class="{
        'text-black font-bold': playerRole === 'black',
        'text-gray-600 font-bold': playerRole === 'white'
      }">
        {{ playerRole === 'black' ? '执黑' : '执白' }}
      </p>
    </div>

    <!-- Media Controls -->
    <div class="mb-4 border-t pt-4">
      <h3 class="text-lg font-bold mb-2">通信控制</h3>
      <div class="flex gap-2">
        <button 
          @click="toggleAudio" 
          class="flex items-center px-3 py-1 rounded"
          :class="audioEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'"
        >
          <span class="material-icons text-sm mr-1">
            {{ audioEnabled ? 'mic' : 'mic_off' }}
          </span>
          {{ audioEnabled ? '关闭语音' : '开启语音' }}
        </button>
        <button 
          @click="toggleVideo"
          class="flex items-center px-3 py-1 rounded"
          :class="videoEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'"
        >
          <span class="material-icons text-sm mr-1">
            {{ videoEnabled ? 'videocam' : 'videocam_off' }}
          </span>
          {{ videoEnabled ? '关闭视频' : '开启视频' }}
        </button>
      </div>
    </div>

    <!-- Game Quick Actions -->
    <div class="mb-4 border-t pt-4">
      <h3 class="text-lg font-bold mb-2">快捷操作</h3>
      <div class="grid grid-cols-2 gap-2">
        <button 
          @click="undoLastMove"
          :disabled="!canUndo"
          class="px-3 py-1 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          悔棋
        </button>
        <button 
          @click="requestDraw"
          :disabled="!isGameActive || drawRequested"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          求和
        </button>
      </div>
    </div>

    <!-- Connection Info -->
    <div class="mt-4 text-sm text-gray-500">
      <p>房间ID: {{ roomId }}</p>
      <p>连接延迟: {{ connectionLatency }}ms</p>
    </div>

    <!-- Game Messages -->
    <div v-if="gameMessage" class="mt-4">
      <div class="p-2 rounded" :class="messageClass">
        {{ gameMessage }}
      </div>
    </div>

    <!-- 在 Game Messages 前添加 -->
    <div class="mb-4 border-t pt-4">
      <MoveHistory ref="moveHistory" />
    </div>

    <!-- 添加观战模式提示 -->
    <div v-if="isSpectator" class="mb-4 bg-blue-50 p-4 rounded-lg">
      <h3 class="text-lg font-bold mb-2">观战模式</h3>
      <p class="text-sm">当前观看: {{ spectateName }}</p>
      <div class="mt-2">
        <button 
          @click="leaveSpectate" 
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          退出观战
        </button>
      </div>
    </div>

    <!-- 添加房间设置 -->
    <div v-if="isRoomOwner" class="mb-4 border-t pt-4">
      <h3 class="text-lg font-bold mb-2">房间设置</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            type="checkbox" 
            v-model="allowSpectators"
            class="form-checkbox h-4 w-4 text-blue-600"
          >
          <span class="ml-2">允许观战</span>
        </label>
        <label class="flex items-center">
          <input 
            type="checkbox" 
            v-model="publicRoom"
            class="form-checkbox h-4 w-4 text-blue-600"
          >
          <span class="ml-2">公开房间</span>
        </label>
      </div>
    </div>
  </div>

  <!-- Add after Game Messages -->
  <div v-if="pendingInvitation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h3 class="text-lg font-bold mb-4">游戏邀请</h3>
      <p class="mb-4">{{ pendingInvitation.from }} 邀请您加入游戏</p>
      <div class="flex justify-end gap-2">
        <button 
          @click="rejectInvitation"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          拒绝
        </button>
        <button 
          @click="acceptInvitation"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          接受
        </button>
      </div>
    </div>
  </div>

  <!-- 在 Game Quick Actions 后添加 -->
  <div class="mb-4 border-t pt-4">
    <GameControls ref="gameControls" />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../../stores/game'
import { useMediaDevices } from '@vueuse/core'
import VideoChat from '../Media/VideoChat.vue'
import QRCode from 'qrcode.vue'
import { useRouter } from 'vue-router'
import GameControls from './GameControls.vue'
import MoveHistory from './MoveHistory.vue'

const gameStore = useGameStore()
const { 
  gameStatus, 
  winner, 
  currentPlayer, 
  lastMove, 
  playerRole,
  isMyTurn 
} = storeToRefs(gameStore)

const drawRequested = ref(false)
const isDrawRequestor = ref(false)
const gameMessage = ref('')

// 添加连接状态
const connectionStatus = ref('disconnected')
const peer = ref(null)

// New refs for media controls and connection info
const audioEnabled = ref(false)
const videoEnabled = ref(false)
const connectionLatency = ref(0)
const canUndo = computed(() => isMyTurn.value && lastMove.value)
const roomId = computed(() => gameStore.roomId)

// 新增观战相关的响应式变量
const isSpectator = ref(false)
const spectateName = ref('')
const isRoomOwner = ref(false)
const allowSpectators = ref(true)
const publicRoom = ref(true)
const moveHistory = ref(null)

const statusText = computed(() => {
  switch (gameStatus.value) {
    case 'waiting':
      return '等待对手加入'
    case 'playing':
      return '对局进行中'
    case 'finished':
      return '对局结束'
    default:
      return '未知状态'
  }
})

const messageClass = computed(() => {
  if (!gameMessage.value) return ''
  return {
    'bg-green-100': gameStatus.value === 'playing',
    'bg-yellow-100': gameStatus.value === 'waiting',
    'bg-red-100': gameStatus.value === 'finished'
  }
})

const formatCoordinates = (move) => {
  const letters = 'ABCDEFGHJKLMNOPQRST'
  return `${letters[move.x]}${move.y + 1}`
}

const acceptDraw = () => {
  gameStore.acceptDraw()
  drawRequested.value = false
}

const rejectDraw = () => {
  gameStore.rejectDraw()
  drawRequested.value = false
  showMessage('已拒绝求和请求')
}

const showMessage = (message, duration = 3000, type = 'info') => {
  gameMessage.value = message
  messageClass.value = {
    'bg-blue-100': type === 'info',
    'bg-green-100': type === 'success',
    'bg-red-100': type === 'error',
    'bg-yellow-100': type === 'warning'
  }
  if (duration) {
    setTimeout(() => {
      gameMessage.value = ''
    }, duration)
  }
}

// 处理连接状态变化
const handleConnectionChange = (status) => {
  connectionStatus.value = status
  showMessage(`连接状态: ${status}`, status === 'connected' ? 2000 : null)
}

// 初始化PeerJS连接
const initPeerConnection = () => {
  peer.value = gameStore.getPeerConnection()
  
  peer.value.on('connection', (conn) => {
    handleConnectionChange('connected')
    
    conn.on('data', (data) => {
      handlePeerData(data)
    })
    
    conn.on('close', () => {
      handleConnectionChange('disconnected')
      showMessage('对手已断开连接')
    })
    
    conn.on('error', (err) => {
      handleConnectionChange('error')
      showMessage(`连接错误: ${err.message}`)
    })
  })

  peer.value.on('call', (call) => {
    call.answer(stream.value)
    call.on('stream', handleMediaStream)
  })
}

// Add data handling
const handlePeerData = (data) => {
  switch (data.type) {
    case 'INVITATION':
      pendingInvitation.value = {
        from: data.from,
        roomId: data.roomId,
        role: data.role
      }
      break
    case 'INVITATION_ACCEPTED':
      showMessage('对手接受了邀请')
      gameStore.startGame(data.roomId, data.role)
      break
    case 'INVITATION_REJECTED':
      showMessage('对手拒绝了邀请')
      break
    case 'MOVE':
      gameControls.value?.playSound('move')
      break
    case 'CAPTURE':
      gameControls.value?.playSound('capture')
      break
    case 'GAME_END':
      gameControls.value?.playSound('gameEnd')
      break
    case 'SPECTATOR_JOIN':
      showMessage(`${data.name} 加入观战`)
      break
    case 'SPECTATOR_LEAVE':
      showMessage(`${data.name} 退出观战`)
      break
    case 'ROOM_SETTINGS_CHANGE':
      if (data.settings) {
        allowSpectators.value = data.settings.allowSpectators
        publicRoom.value = data.settings.publicRoom
      }
      break
  }
}

// Media controls
const { stream, start: startMedia, stop: stopMedia } = useMediaDevices({
  audio: true,
  video: true
})

const toggleAudio = async () => {
  try {
    if (!audioEnabled.value) {
      await startMedia({ audio: true, video: false })
      audioEnabled.value = true
      gameStore.updateMediaStream(stream.value)
    } else {
      stopMedia()
      audioEnabled.value = false
      gameStore.updateMediaStream(null)
    }
  } catch (error) {
    showMessage('无法访问麦克风: ' + error.message)
  }
}

const toggleVideo = async () => {
  try {
    if (!videoEnabled.value) {
      await startMedia({ video: true })
      videoEnabled.value = true
      gameStore.updateMediaStream(stream.value)
    } else {
      stopMedia()
      videoEnabled.value = false
      gameStore.updateMediaStream(null)
    }
  } catch (error) {
    showMessage('无法访问摄像头: ' + error.message)
  }
}

// Game actions
const undoLastMove = () => {
  if (canUndo.value) {
    gameStore.requestUndo()
    showMessage('已发送悔棋请求')
  }
}

const requestDraw = () => {
  if (!drawRequested.value) {
    gameStore.requestDraw()
    isDrawRequestor.value = true
    drawRequested.value = true
    showMessage('已发送求和请求')
  }
}

// Connection monitoring
let pingInterval
onMounted(() => {
  initPeerConnection()

  // Start ping monitoring
  pingInterval = setInterval(() => {
    const start = Date.now()
    peer.value?.socket?.send('ping')
    peer.value?.socket?.once('pong', () => {
      connectionLatency.value = Date.now() - start
    })
  }, 5000)

  // 初始化房间设置
  isRoomOwner.value = gameStore.isRoomOwner
  if (gameStore.spectateMode) {
    isSpectator.value = true
    spectateName.value = gameStore.spectateName
  }
})

onUnmounted(() => {
  if (peer.value) {
    peer.value.destroy()
  }
  clearInterval(pingInterval)
  stopMedia()
})

// 监听游戏状态变化
watch(() => gameStatus.value, (newStatus) => {
  if (newStatus === 'finished') {
    showMessage(winner.value ? 
      `游戏结束，${winner.value === 'black' ? '黑方' : '白方'}获胜！` : 
      '游戏结束，平局！'
    )
  }
})

// 监听房间设置变化
watch([allowSpectators, publicRoom], () => {
  if (isRoomOwner.value) {
    gameStore.updateRoomSettings(roomSettings.value)
  }
})

// Expose methods for parent component
defineExpose({
  showMessage,
  handleConnectionChange,
  updateMoveHistory: (index) => {
    moveHistory.value?.setCurrentMove(index)
  }
})
</script>

<style scoped>
.fixed {
  z-index: 1000;
}

input[readonly] {
  background-color: #f8f9fa;
}

.material-icons {
  font-family: 'Material Icons';
  font-size: 18px;
}

button:disabled {
  cursor: not-allowed;
}

/* 添加新样式 */
.form-checkbox {
  @apply rounded border-gray-300;
}

.form-checkbox:checked {
  @apply bg-blue-600 border-transparent;
}
</style>
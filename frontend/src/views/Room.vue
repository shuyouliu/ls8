<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- 左侧游戏区 -->
    <div class="flex-1 p-4">
      <div class="bg-white rounded-lg shadow p-4">
        <GameBoard :game-type="gameType" />
      </div>
    </div>

    <!-- 右侧控制区 -->
    <div class="w-80 bg-white p-4 shadow">
      <!-- 房间信息 -->
      <div class="mb-4">
        <h2 class="text-lg font-bold mb-2">房间信息</h2>
        <div class="flex items-center space-x-2">
          <QRCode :value="roomUrl" :size="100" level="M" />
          <button @click="copyRoomUrl" class="text-blue-500">
            复制链接
          </button>
        </div>
      </div>

      <!-- 游戏控制 -->
      <div class="mb-4">
        <select v-model="gameType" class="w-full p-2 border rounded">
          <option value="chess">象棋</option>
          <option value="go">围棋</option>
        </select>
      </div>

      <!-- 通信控制 -->
      <div class="space-y-2">
        <button @click="toggleAudio" class="w-full p-2 bg-blue-500 text-white rounded">
          {{ isAudioEnabled ? '关闭语音' : '开启语音' }}
        </button>
        <button @click="toggleVideo" class="w-full p-2 bg-blue-500 text-white rounded">
          {{ isVideoEnabled ? '关闭视频' : '开启视频' }}
        </button>
      </div>

      <!-- 视频显示区 -->
      <div class="mt-4">
        <video ref="localVideo" muted autoplay class="w-full mb-2"></video>
        <video ref="remoteVideo" autoplay class="w-full"></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode.vue'
import GameBoard from '../components/Board/GameBoard.vue'
import peerService from '../services/peer'

const route = useRoute()
const gameType = ref('chess')
const isAudioEnabled = ref(false)
const isVideoEnabled = ref(false)
const localVideo = ref(null)
const remoteVideo = ref(null)

const roomUrl = `${window.location.origin}/room/${route.params.id}`

const copyRoomUrl = async () => {
  await navigator.clipboard.writeText(roomUrl)
  alert('链接已复制')
}

onMounted(async () => {
  try {
    await peerService.init()
    peerService.onConnection((conn) => {
      console.log('Peer connected:', conn)
    })
  } catch (error) {
    console.error('Connection failed:', error)
  }
})

onUnmounted(() => {
  if (peerService.peer) {
    peerService.peer.destroy()
  }
})
</script>
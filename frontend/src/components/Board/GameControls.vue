<template>
  <div class="bg-white rounded-lg shadow p-4">
    <!-- 游戏控制面板 -->
    <div class="space-y-4">
      <!-- 游戏设置 -->
      <div>
        <h3 class="text-lg font-bold mb-2">游戏设置</h3>
        <div class="grid grid-cols-2 gap-2">
          <button 
            @click="saveGame" 
            class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            保存对局
          </button>
          <button 
            @click="loadGame"
            class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            读取对局
          </button>
        </div>
      </div>

      <!-- 游戏进度 -->
      <div>
        <h3 class="text-lg font-bold mb-2">对局进度</h3>
        <div class="flex items-center gap-2">
          <button 
            @click="prevMove"
            :disabled="!canNavigateHistory"
            class="px-2 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            <span class="material-icons">arrow_back</span>
          </button>
          <div class="flex-1 text-center">
            第 {{ currentMoveIndex + 1 }}/{{ totalMoves }} 手
          </div>
          <button 
            @click="nextMove"
            :disabled="!canNavigateHistory"
            class="px-2 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            <span class="material-icons">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- 游戏音效控制 -->
      <div>
        <h3 class="text-lg font-bold mb-2">音效设置</h3>
        <div class="flex items-center gap-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="soundEnabled"
              class="form-checkbox h-4 w-4 text-blue-600"
            >
            <span class="ml-2">落子音效</span>
          </label>
          <input 
            type="range" 
            v-model="volume" 
            min="0" 
            max="100"
            class="flex-1"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const soundEnabled = ref(true)
const volume = ref(50)
const currentMoveIndex = ref(0)

// 计算属性
const totalMoves = computed(() => gameStore.moveHistory.length)
const canNavigateHistory = computed(() => gameStore.gameStatus === 'finished')

// 保存和加载游戏
const saveGame = () => {
  const gameData = gameStore.getGameState()
  localStorage.setItem('savedGame', JSON.stringify(gameData))
  showMessage('游戏已保存', 'success')
}

const loadGame = () => {
  try {
    const savedGame = localStorage.getItem('savedGame')
    if (savedGame) {
      const gameData = JSON.parse(savedGame)
      gameStore.loadGameState(gameData)
      showMessage('游戏已加载', 'success')
    }
  } catch (error) {
    showMessage('加载游戏失败', 'error')
  }
}

// 历史导航
const prevMove = () => {
  if (currentMoveIndex.value > 0) {
    currentMoveIndex.value--
    gameStore.showHistoryMove(currentMoveIndex.value)
  }
}

const nextMove = () => {
  if (currentMoveIndex.value < totalMoves.value - 1) {
    currentMoveIndex.value++
    gameStore.showHistoryMove(currentMoveIndex.value)
  }
}

// 播放音效
const playSound = (type) => {
  if (!soundEnabled.value) return
  
  const audio = new Audio()
  audio.volume = volume.value / 100
  
  switch (type) {
    case 'move':
      audio.src = '/sounds/move.mp3'
      break
    case 'capture':
      audio.src = '/sounds/capture.mp3'
      break
    case 'gameEnd':
      audio.src = '/sounds/game-end.mp3'
      break
  }
  
  audio.play()
}

// 导出方法供父组件使用
defineExpose({
  playSound
})
</script>
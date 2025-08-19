<template>
  <div class="flex flex-col gap-4">
    <!-- Timer Display -->
    <div class="flex justify-between p-4 bg-gray-100 rounded-lg">
      <div class="text-center" :class="{ 'bg-yellow-100 p-2 rounded': currentPlayer === 'black' }">
        <div class="text-sm text-gray-600">黑方时间</div>
        <div class="text-xl font-bold" :class="{ 'text-red-500': blackTime < 60 }">
          {{ formatTime(blackTime) }}
        </div>
      </div>
      <div class="text-center" :class="{ 'bg-yellow-100 p-2 rounded': currentPlayer === 'white' }">
        <div class="text-sm text-gray-600">白方时间</div>
        <div class="text-xl font-bold" :class="{ 'text-red-500': whiteTime < 60 }">
          {{ formatTime(whiteTime) }}
        </div>
      </div>
    </div>

    <!-- Game Controls -->
    <div class="flex gap-2">
      <button 
        @click="handleSurrender"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        :disabled="!isGameActive"
      >
        认输
      </button>
      <button 
        @click="handleDrawRequest"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        :disabled="!isGameActive"
      >
        求和
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const { timeRemaining, currentPlayer, gameStatus } = storeToRefs(gameStore)

const timer = ref(null)
const blackTime = computed(() => timeRemaining.value.black)
const whiteTime = computed(() => timeRemaining.value.white)
const isGameActive = computed(() => gameStatus.value === 'playing')

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleSurrender = () => {
  if (confirm('确定要认输吗？')) {
    gameStore.surrender()
  }
}

const handleDrawRequest = () => {
  if (confirm('确定要求和吗？')) {
    gameStore.requestDraw()
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

const startTimer = () => {
  stopTimer()
  timer.value = setInterval(() => {
    if (gameStatus.value === 'playing') {
      timeRemaining.value[currentPlayer.value]--
      
      if (timeRemaining.value[currentPlayer.value] <= 0) {
        stopTimer()
        gameStore.gameStatus = 'finished'
        gameStore.winner = currentPlayer.value === 'black' ? 'white' : 'black'
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// Watch for game status changes
watch(() => gameStatus.value, (newStatus) => {
  if (newStatus === 'playing') {
    startTimer()
  } else {
    stopTimer()
  }
})
</script>
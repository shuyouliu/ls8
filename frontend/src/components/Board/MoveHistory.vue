<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-bold mb-2">对局记录</h3>
    <div class="max-h-64 overflow-y-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-2 py-1">回合</th>
            <th class="px-2 py-1">黑方</th>
            <th class="px-2 py-1">白方</th>
            <th class="px-2 py-1">用时</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(move, index) in moveHistory" :key="index" 
              :class="{ 'bg-blue-50': currentMoveIndex === index }">
            <td class="px-2 py-1 text-center">{{ Math.floor(index/2) + 1 }}</td>
            <td class="px-2 py-1">{{ index % 2 === 0 ? formatMove(move) : '' }}</td>
            <td class="px-2 py-1">{{ index % 2 === 1 ? formatMove(move) : '' }}</td>
            <td class="px-2 py-1 text-right">{{ formatTime(move.time) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const currentMoveIndex = ref(0)

const moveHistory = computed(() => gameStore.moveHistory)

const formatMove = (move) => {
  const letters = 'ABCDEFGHJKLMNOPQRST'
  return `${letters[move.x]}${move.y + 1}`
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

defineExpose({
  setCurrentMove: (index) => {
    currentMoveIndex.value = index
  }
})
</script>
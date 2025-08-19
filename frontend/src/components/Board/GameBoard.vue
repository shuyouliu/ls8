<template>
  <div class="relative">
    <v-stage
      :config="stageConfig"
      @click="handleBoardClick"
    >
      <v-layer>
        <!-- 棋盘背景 -->
        <v-rect
          :config="{
            width: boardSize,
            height: boardSize,
            fill: '#DEB887'
          }"
        />
        
        <!-- 棋盘网格 -->
        <template v-for="i in gridLines" :key="i">
          <v-line
            :config="{
              points: [
                padding + i * gridSize,
                padding,
                padding + i * gridSize,
                boardSize - padding
              ],
              stroke: '#000',
              strokeWidth: 1
            }"
          />
          <v-line
            :config="{
              points: [
                padding,
                padding + i * gridSize,
                boardSize - padding,
                padding + i * gridSize
              ],
              stroke: '#000',
              strokeWidth: 1
            }"
          />
        </template>

        <!-- 棋子 -->
        <v-circle
          v-for="piece in pieces"
          :key="`${piece.x}-${piece.y}`"
          :config="{
            x: padding + piece.x * gridSize,
            y: padding + piece.y * gridSize,
            radius: pieceRadius,
            fill: piece.color,
            shadowBlur: 5
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/game'

const props = defineProps({
  gameType: {
    type: String,
    required: true
  }
})

const boardSize = 600
const padding = 30
const gridSize = (boardSize - 2 * padding) / (props.gameType === 'go' ? 18 : 8)
const pieceRadius = gridSize * 0.4

const stageConfig = {
  width: boardSize,
  height: boardSize
}

const gridLines = computed(() => 
  props.gameType === 'go' ? 19 : 9
)

const pieces = ref([])

const handleBoardClick = (e) => {
  const stage = e.target.getStage()
  const point = stage.getPointerPosition()
  
  // 转换为棋盘坐标
  const x = Math.round((point.x - padding) / gridSize)
  const y = Math.round((point.y - padding) / gridSize)
  
  // 添加新棋子
  pieces.value.push({
    x,
    y,
    color: pieces.value.length % 2 === 0 ? 'black' : 'white'
  })
}
</script>
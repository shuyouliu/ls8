<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()

// 游戏数据
const games = [
  {
    id: 'chess',
    name: '中国象棋',
    icon: 'fa-chess',
    description: '中国传统棋类游戏，有着悠久的历史和丰富的文化内涵。',
    players: 2
  },
  {
    id: 'go',
    name: '围棋',
    icon: 'fa-chess-board',
    description: '起源于中国的古老棋类游戏，被誉为"智慧的体操"。',
    players: 2
  },
  {
    id: 'gomoku',
    name: '五子棋',
    icon: 'fa-chess-pawn',
    description: '简单易学的棋类游戏，适合各个年龄段的玩家。',
    players: 2
  },
  {
    id: 'checkers',
    name: '跳棋',
    icon: 'fa-chess-knight',
    description: '经典的策略型棋类游戏，考验玩家的规划能力。',
    players: 2
  }
]

// 进入游戏房间
const enterGameRoom = (gameId) => {
  // 生成随机房间ID
  const roomId = Math.random().toString(36).substring(2, 10)
  router.push({ name: 'Room', params: { id: roomId }, query: { game: gameId } })
}
</script>

<template>
  <div class="games-container">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">游戏大厅</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="game in games" :key="game.id" class="game-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="game-icon bg-blue-100 p-6 flex justify-center items-center">
          <FontAwesomeIcon :icon="game.icon" size="48px" class="text-blue-600" />
        </div>
        <div class="game-info p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-2">{{ game.name }}</h2>
          <p class="text-gray-600 mb-4">{{ game.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ game.players }} 人游戏</span>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              @click="enterGameRoom(game.id)"
            >
              开始游戏
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">如何开始游戏</h2>
      <ol class="list-decimal list-inside text-left max-w-2xl mx-auto text-gray-700 space-y-2">
        <li>选择您想玩的游戏</li>
        <li>点击"开始游戏"按钮创建房间</li>
        <li>复制房间链接并发送给您的朋友</li>
        <li>等待朋友加入后即可开始游戏</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.games-container {
  padding: 2rem 0;
}

.game-card {
  transition: transform 0.3s ease;
}

.game-card:hover {
  transform: translateY(-5px);
}
</style>
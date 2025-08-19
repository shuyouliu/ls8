<template>
  <div class="flex flex-col h-64 bg-white rounded-lg shadow">
    <!-- Chat Messages -->
    <div class="flex-1 p-4 overflow-y-auto" ref="chatContainer">
      <div v-for="(msg, index) in messages" :key="index" 
           class="mb-2" :class="{ 'text-right': msg.isMe }">
        <div class="inline-block p-2 rounded" 
             :class="msg.isMe ? 'bg-blue-100' : 'bg-gray-100'">
          <div class="text-xs text-gray-500">{{ msg.sender }}</div>
          <div>{{ msg.content }}</div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t p-2">
      <div class="flex gap-2">
        <input type="text" v-model="newMessage" 
               @keyup.enter="sendMessage"
               class="flex-1 px-2 py-1 border rounded"
               placeholder="输入消息...">
        <button @click="sendMessage" 
                class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const { playerRole } = storeToRefs(gameStore)

const messages = ref([])
const newMessage = ref('')
const chatContainer = ref(null)

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const message = {
    content: newMessage.value,
    sender: playerRole.value === 'black' ? '黑方' : '白方',
    isMe: true,
    timestamp: Date.now()
  }

  messages.value.push(message)
  newMessage.value = ''

  // 发送消息到对手
  gameStore.sendChatMessage(message.content)

  // 滚动到底部
  await nextTick()
  scrollToBottom()
}

const receiveMessage = (content) => {
  messages.value.push({
    content,
    sender: playerRole.value === 'black' ? '白方' : '黑方',
    isMe: false,
    timestamp: Date.now()
  })
  scrollToBottom()
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 导出接收消息方法供外部调用
defineExpose({
  receiveMessage
})

onMounted(() => {
  // 添加系统消息
  messages.value.push({
    content: '游戏开始，祝您游戏愉快！',
    sender: '系统',
    isMe: false,
    timestamp: Date.now()
  })
})
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}
</style>
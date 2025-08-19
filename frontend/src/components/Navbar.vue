<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const isMenuOpen = ref(false)

// 导航菜单数据
const menuItems = [
  { name: '首页', path: '/', icon: 'fa-home' },
  { name: '游戏', path: '/games', icon: 'fa-gamepad' }
]

// 处理菜单点击
const handleMenuClick = (path) => {
  router.push(path)
  isMenuOpen.value = false
}
</script>

<template>
  <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <!-- 网站标志 -->
      <div class="flex items-center space-x-2">
        <img src="/vite.svg" alt="LS8 Logo" class="h-8 w-8" />
        <h1 class="text-xl font-bold">LS8 - Love Son Platform</h1>
      </div>

      <!-- 桌面导航 -->
      <nav class="hidden md:flex space-x-6">
        <a
          v-for="item in menuItems"
          :key="item.path"
          :href="item.path"
          class="flex items-center space-x-1 hover:text-blue-200 transition-colors"
          @click.prevent="handleMenuClick(item.path)"
        >
          <FontAwesomeIcon :icon="item.icon" />
          <span>{{ item.name }}</span>
        </a>
      </nav>

      <!-- 简化的导航栏右侧 -->
      <div></div>

      <!-- 移动端菜单按钮 -->
      <button
        class="md:hidden text-white focus:outline-none"
        @click="isMenuOpen = !isMenuOpen"
      >
        <FontAwesomeIcon icon="fa-bars" size="24px" />
      </button>
    </div>

    <!-- 移动端导航菜单 -->
    <div v-if="isMenuOpen" class="md:hidden bg-blue-700 py-2 px-4 shadow-inner">
      <a
        v-for="item in menuItems"
        :key="item.path"
        :href="item.path"
        class="flex items-center space-x-2 py-2 px-4 hover:bg-blue-600 rounded-md transition-colors"
        @click.prevent="handleMenuClick(item.path)"
      >
        <FontAwesomeIcon :icon="item.icon" />
        <span>{{ item.name }}</span>
      </a>
      <div class="flex flex-col space-y-2 py-2 px-4 mt-2 border-t border-blue-600">
        <button class="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
          登录
        </button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors">
          注册
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 导航栏样式 */
header {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
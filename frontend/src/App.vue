<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { onMounted } from 'vue'
import { useErrorHandler } from '@/services/errorHandler'

// 初始化错误处理
const errorHandler = useErrorHandler()

onMounted(() => {
  console.log('LS8 - Love Son Platform 已启动')
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容区 -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<style scoped>
/* 全局样式已在style.css中定义 */
</style>

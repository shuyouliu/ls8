<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <FontAwesomeIcon icon="fa-solid fa-users" class="h-8 w-8 text-indigo-600" />
              <span class="ml-2 text-xl font-bold text-gray-900">LS8</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <a href="#features" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">功能</a>
            <a href="#how-it-works" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">使用方法</a>
            <a href="#download" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">下载</a>
            <button
              @click="createRoom"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              立即开始
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pt-8 pb-16 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36 xl:pt-40 xl:pb-48">
          <div class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div class="text-center">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">相隔千里，</span>
                <span class="block text-indigo-600 xl:inline">近在咫尺</span>
              </h1>
              <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                LS8 让亲子、亲友间的深度互动不受距离限制，随时随地共享欢乐时光，创造珍贵回忆。
              </p>
              <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div class="rounded-md shadow">
                  <button
                    @click="createRoom"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
                  >
                    创建互动房间
                    <FontAwesomeIcon icon="fa-solid fa-chevron-right" class="ml-2 -mr-1 h-5 w-5" />
                  </button>
                </div>
                <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <button
                    @click="showJoinModal = true"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
                  >
                    加入现有房间
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 装饰图形 -->
      <div class="absolute inset-y-0 right-0 w-full md:w-1/2 bg-gradient-to-l from-indigo-100 to-transparent opacity-70 pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-full md:w-1/2 h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <svg class="absolute h-full w-full text-indigo-800 opacity-10" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="50,0 100,0 100,100 0,100" />
        </svg>
      </div>
    </div>

    <!-- 特色功能 -->
    <section id="features" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            为亲友互动精心打造
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            简单易用的功能，让每一次互动都充满欢乐
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 功能卡片 1 -->
          <div class="relative bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div class="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg"></div>
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-6">
              <FontAwesomeIcon icon="fa-solid fa-gamepad" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">互动游戏</h3>
            <p class="text-base text-gray-500">
              支持象棋、围棋等多种传统游戏，让家人朋友在线对弈，共享博弈乐趣。
            </p>
          </div>

          <!-- 功能卡片 2 -->
          <div class="relative bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div class="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg"></div>
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-6">
              <FontAwesomeIcon icon="fa-solid fa-video" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">视频通话</h3>
            <p class="text-base text-gray-500">
              高清视频通话，支持多人同时在线，让远程沟通更有温度，如同身临其境。
            </p>
          </div>

          <!-- 功能卡片 3 -->
          <div class="relative bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div class="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg"></div>
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-6">
              <FontAwesomeIcon icon="fa-solid fa-comment" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">实时聊天</h3>
            <p class="text-base text-gray-500">
              即时消息功能，支持文字、图片和表情，让交流更加丰富多彩。
            </p>
          </div>

          <!-- 功能卡片 4 -->
          <div class="relative bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div class="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg"></div>
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-6">
              <FontAwesomeIcon icon="fa-solid fa-share-square" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">屏幕共享</h3>
            <p class="text-base text-gray-500">
              共享屏幕功能，方便远程指导、教学或一起观看照片和视频。
            </p>
          </div>

          <!-- 功能卡片 5 -->
          <div class="relative bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div class="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg"></div>
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-6">
              <FontAwesomeIcon icon="fa-solid fa-image" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">家庭相册</h3>
            <p class="text-base text-gray-500">
              共享家庭照片和视频，创建专属家庭相册，记录美好时光。
            </p>
          </div>

          <!-- 功能卡片 6 -->
          <div class="relative bg-white rounded-lg shadow p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div class="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg"></div>
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-6">
              <FontAwesomeIcon icon="fa-solid fa-shield" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">安全可靠</h3>
            <p class="text-base text-gray-500">
              点对点加密通信，保障隐私安全，让您的互动更加安心。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用方法 -->
    <section id="how-it-works" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            简单三步，即刻连接
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            无需复杂设置，轻松开始与家人朋友的互动
          </p>
        </div>

        <div class="mt-16 relative">
          <!-- 连接线 -->
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-between">
            <!-- 步骤 1 -->
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                1
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">创建房间</h3>
              <p class="text-base text-gray-500 text-center max-w-xs">
                点击"创建互动房间"按钮，生成专属房间ID
              </p>
            </div>

            <!-- 步骤 2 -->
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                2
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">邀请亲友</h3>
              <p class="text-base text-gray-500 text-center max-w-xs">
                分享房间ID给家人朋友，邀请他们加入
              </p>
            </div>

            <!-- 步骤 3 -->
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                3
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">开始互动</h3>
              <p class="text-base text-gray-500 text-center max-w-xs">
                亲友加入后，即可开始视频通话、游戏等互动
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 下载区域 -->
    <section id="download" class="py-16 bg-indigo-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold sm:text-4xl">
            跨平台支持，随时连接
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-indigo-100 mx-auto">
            无论您使用电脑、手机还是平板，都能轻松享受LS8带来的互动体验
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <button class="bg-white text-indigo-600 px-6 py-3 rounded-md shadow-md flex items-center hover:bg-gray-100 transition-colors">
              <svg class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <div class="text-left">
                <div class="text-xs font-semibold">下载</div>
                <div class="font-bold">Windows 版</div>
              </div>
            </button>
            <button class="bg-white text-indigo-600 px-6 py-3 rounded-md shadow-md flex items-center hover:bg-gray-100 transition-colors">
              <svg class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.75,10.35C17.67,10.35 17.59,10.36 17.5,10.36C16.9,10.36 16.35,10.64 15.95,11.05C15.5,11.5 15.25,12.06 15.25,12.68C15.25,13.3 15.5,13.86 15.95,14.31C16.35,14.72 16.9,15 17.5,15C18.12,15 18.68,14.72 19.08,14.31C19.53,13.86 19.78,13.3 19.78,12.68C19.78,12.06 19.53,11.5 19.08,11.05C18.68,10.64 18.12,10.35 17.75,10.35M12.83,5H9.17C7.88,5 6.84,5.84 6.84,7V17C6.84,18.16 7.88,19 9.17,19H14.83C16.12,19 17.16,18.16 17.16,17V12.8C17.68,12.55 18.16,12.22 18.5,11.83C16.97,11.5 15.91,10.47 15.91,9.07C15.91,7.6 16.97,6.5 18.44,6.3C18.17,5.5 17.5,4.75 16.5,4.26C15.67,3.86 14.67,3.67 13.67,3.67C12.93,3.67 12.22,3.77 11.55,4C11.38,4.08 11.22,4.17 11.05,4.26L12.83,5M18.92,8.86C18.72,8.93 18.5,9 18.28,9.11C18.34,9.5 18.38,9.9 18.38,10.3C18.38,11.5 17.94,12.59 17.07,13.46L15.94,12.5C16.22,12.2 16.44,11.82 16.58,11.43C16.72,11.03 16.78,10.6 16.78,10.17C16.78,9.6 16.67,9.07 16.44,8.63C16.34,8.45 16.3,8.24 16.3,8.03C16.3,7.26 16.78,6.59 17.58,6.34C18.24,6.13 19.07,6.26 19.67,6.69C20.27,7.11 20.67,7.77 20.67,8.5C20.67,8.67 20.63,8.79 20.58,8.92H18.92Z" />
              </svg>
              <div class="text-left">
                <div class="text-xs font-semibold">下载</div>
                <div class="font-bold">macOS 版</div>
              </div>
            </button>
            <button class="bg-white text-indigo-600 px-6 py-3 rounded-md shadow-md flex items-center hover:bg-gray-100 transition-colors">
              <svg class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,1H7A2,2 0 0,0 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3A2,2 0 0,0 17,1M17,19H7V5H17V19Z" />
              </svg>
              <div class="text-left">
                <div class="text-xs font-semibold">访问</div>
                <div class="font-bold">网页版</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">LS8</h3>
            <p class="text-gray-400">
              让亲情和友情不受距离限制
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">快速链接</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">功能</a></li>
              <li><a href="#how-it-works" class="hover:text-white transition-colors">使用方法</a></li>
              <li><a href="#download" class="hover:text-white transition-colors">下载</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">支持</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">帮助中心</a></li>
              <li><a href="#" class="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">关注我们</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2023 LS8. 保留所有权利。</p>
        </div>
      </div>
    </footer>

    <!-- 加入房间模态框 -->
    <div v-if="showJoinModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">加入房间</h3>
          <button @click="showJoinModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <label for="roomId" class="block text-sm font-medium text-gray-700 mb-1">房间ID</label>
          <input
            id="roomId"
            v-model="roomId"
            type="text"
            placeholder="请输入房间ID"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="showJoinModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="joinRoom"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            加入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import peerService from '@/services/peer'
import { useErrorHandler } from '@/services/errorHandler'

const router = useRouter()
const gameStore = useGameStore()
const errorHandler = useErrorHandler()

const showJoinModal = ref(false)
const roomId = ref('')

// 创建房间
const createRoom = () => {
  try {
    // 生成随机房间ID
    const newRoomId = Math.random().toString(36).substring(2, 10)
    gameStore.startGame(newRoomId, 'black', true)
    router.push({ name: 'Room', params: { id: newRoomId } })
  } catch (error) {
    errorHandler.handleError(error, '创建房间失败')
  }
}

// 加入房间
const joinRoom = () => {
  if (!roomId.value.trim()) {
    errorHandler.handleError(new Error('房间ID不能为空'), '加入房间失败')
    return
  }

  try {
    gameStore.startGame(roomId.value, 'white', false)
    router.push({ name: 'Room', params: { id: roomId.value } })
    showJoinModal.value = false
  } catch (error) {
    errorHandler.handleError(error, '加入房间失败')
  }
}
</script>

<style scoped>
/* 这里可以添加组件特定的样式 */
</style>
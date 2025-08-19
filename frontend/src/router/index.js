import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import Games from '../views/Games.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'LS8 - 首页'
      }
    },
    {
      path: '/games',
      name: 'Games',
      component: Games,
      meta: {
        title: 'LS8 - 游戏'
      }
    },
    {
      path: '/room/:id',
      name: 'Room',
      component: Room,
      props: true,
      meta: {
        title: 'LS8 - 游戏房间'
      }
    },
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
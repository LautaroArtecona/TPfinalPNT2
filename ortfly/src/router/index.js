import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClientDashboardView from '../views/ClientDashboardView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cliente',
      name: 'cliente-dashboard',
      component: ClientDashboardView
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboardView
    }
  ]
})

export default router
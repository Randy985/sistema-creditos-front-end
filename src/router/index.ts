import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pages
import LoginPage from '@/pages/auth/LoginPage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage, meta: { guest: true } },

  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: DashboardPage },
      { path: 'solicitud-de-credito', component: () => import('@/pages/credit-request/CreditRequestPage.vue') },
      { path: 'documentacion', component: () => import('@/pages/documentation/DocumentationPage.vue') },
      { path: 'autorizacion', component: () => import('@/pages/authorization/AuthorizationPage.vue') },
      { path: 'servicio-al-cliente', component: () => import('@/pages/customer-service/CustomerServicePage.vue') },
      { path: 'analitica', component: () => import('@/pages/analytics/AnalyticsPage.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!auth.user && localStorage.getItem('user')) auth.initialize()
  if (to.meta.requiresAuth && !auth.accessToken) return '/login'
  if (to.meta.guest && auth.accessToken) return '/dashboard'
})

export default router

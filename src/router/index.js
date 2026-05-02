import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '../views/CatalogView.vue'
import AdminView from '../views/AdminView.vue'
import AuthView from '../views/AuthView.vue'
import ContactView from '../views/ContactView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', redirect: '/catalogo' },
  { path: '/catalogo', name: 'Catalog', component: CatalogView },
  { path: '/admin', name: 'Admin', component: AdminView },
  { path: '/auth', name: 'Auth', component: AuthView },
  { path: '/contacto', name: 'Contact', component: ContactView },
  {path: '/nosotros', name: 'About', component: AboutView}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

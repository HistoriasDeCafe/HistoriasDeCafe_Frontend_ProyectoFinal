<template>
  <div class="app-wrapper">
    <MainNavbar v-if="activePage !== 'Admin'" />

    <main class="main-content">
      <div class="debug-menu">
        <button @click="activePage = 'Contact'">Ver Contacto</button>
        <button @click="activePage = 'Admin'">Ver Panel Admin</button>
        <button @click="activePage = 'Catalog'">Ver Catalogo</button>
      </div>

      <!-- Renderizado Condicional corregido -->
      <ContactView v-if="activePage === 'Contact'" />
      <AdminView   v-if="activePage === 'Admin'" />
      <CatalogView v-if="activePage === 'Catalog'" />
    </main>

    <Footer v-if="activePage !== 'Admin'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainNavbar from './components/MainNavbar.vue'
import Footer from './components/Footer.vue'
import ContactView from './views/ContactView.vue'
import AdminView from './views/AdminView.vue' 
import CatalogView from './views/CatalogView.vue' // Extensión corregida

const activePage = ref('Admin') // poner la que vamos a probar
</script>

<template>
  <div class="app-wrapper">
    <!-- El Navbar lo dejamos si quieres ver cómo queda con el admin, 
         pero el AdminView ya trae su propio Sidebar -->
    <MainNavbar v-if="activePage !== 'Admin'" />

    <main class="main-content">
      <!-- Botones temporales para switchear (como un router manual) -->
      <div class="debug-menu">
        <button @click="activePage = 'Contact'">Ver Contacto</button>
        <button @click="activePage = 'Admin'">Ver Panel Admin</button>
      </div>

      <!-- Renderizado Condicional -->
      <ContactView v-if="activePage === 'Contact'" />
      <AdminView   v-if="activePage === 'Admin'" />
    </main>

    <Footer v-if="activePage !== 'Admin'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainNavbar from './components/MainNavbar.vue'
import Footer from './components/Footer.vue'
import ContactView from './views/ContactView.vue'
// IMPORTA TU NUEVA VISTA AQUÍ
import AdminView from './views/AdminView.vue' 

const activePage = ref('Admin') // Cambia a 'Admin' para que sea lo primero que veas
</script>

<style>
/* Estilos base */
body {
  background: var(--color-background);
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Solo aplicamos padding si no estamos en modo Admin 
   porque el Admin suele ocupar toda la pantalla */
.main-content {
  min-height: 80vh;
}

/* Estilo para tus botones de prueba */
.debug-menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: rgba(0,0,0,0.7);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
}
.debug-menu button {
  background: #B08D57;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
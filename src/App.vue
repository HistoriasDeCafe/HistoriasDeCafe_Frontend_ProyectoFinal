<template>
  <div class="app-wrapper">
    <!-- 1. Pasamos el conteo al Navbar y escuchamos el evento de abrir -->
    <MainNavbar 
      v-if="activePage !== 'Admin'" 
      :cartCount="carrito.length"
      @open-cart="isCartOpen = true" 
    />

    <main class="main-content">
      <div class="debug-menu">
        <button @click="activePage = 'Contact'">Ver Contacto</button>
        <button @click="activePage = 'Admin'">Ver Panel Admin</button>
        <button @click="activePage = 'Catalog'">Ver Catalogo</button>
      </div>

      <ContactView v-if="activePage === 'Contact'" />
      <AdminView   v-if="activePage === 'Admin'" />
      
      <!-- 2. Escuchamos cuando el catálogo añade un producto -->
      <CatalogView 
        v-if="activePage === 'Catalog'" 
        @add-to-cart="handleAddToCart"
      />
    </main>

    <!-- 3. Componente Carrito con sus props y eventos -->
    <CartSidebar 
      :isOpen="isCartOpen" 
      :items="carrito" 
      @close="isCartOpen = false"
      @update-cart="carrito = $event"
    />

    <Footer v-if="activePage !== 'Admin'" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MainNavbar from './components/MainNavbar.vue'
import Footer from './components/Footer.vue'
import ContactView from './views/ContactView.vue'
import AdminView from './views/AdminView.vue' 
import CatalogView from './views/CatalogView.vue'
import CartSidebar from './components/CartSidebar.vue'

const activePage = ref('Catalog') // Cambiado a Catalog para probar de una
const isCartOpen = ref(false)
const carrito = ref([])

// 4. Cargar persistencia del LocalStorage
onMounted(() => {
  const saved = localStorage.getItem("carritoCafe")
  if (saved) carrito.value = JSON.parse(saved)
})

// 5. Guardar automáticamente cuando cambie el carrito
watch(carrito, (newVal) => {
  localStorage.setItem("carritoCafe", JSON.stringify(newVal))
}, { deep: true })

// 6. Lógica para añadir productos
const handleAddToCart = (producto) => {
  const existe = carrito.value.find(p => p.nombre === producto.nombre)
  if (existe) {
    existe.cantidad++
  } else {
    carrito.value.push({ ...producto, cantidad: 1 })
  }
  isCartOpen.value = true // Abre el carrito automáticamente al añadir
}
</script>

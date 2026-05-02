<template>
  <div class="app-wrapper">
    <MainNavbar 
      v-if="!['Admin', 'Auth'].includes($route.name)" 
      :cartCount="totalUnidades"
      @open-cart="isCartOpen = true"
    />

    <main class="main-content">
      <router-view @add-to-cart="handleAddToCart" />
    </main>

    <CartSidebar 
      :isOpen="isCartOpen" 
      :items="carrito" 
      @close="isCartOpen = false"
      @update-cart="carrito = $event"
    />

    <Footer v-if="!['Admin', 'Auth'].includes($route.name)" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainNavbar from './components/MainNavbar.vue'
import Footer from './components/Footer.vue'
import CartSidebar from './components/CartSidebar.vue'

const route = useRoute()
const isCartOpen = ref(false)
const carrito = ref([])

const totalUnidades = computed(() => {
  return carrito.value.reduce((acc, item) => acc + item.cantidad, 0)
})

onMounted(() => {
  const saved = localStorage.getItem("carritoCafe")
  if (saved) carrito.value = JSON.parse(saved)
})

watch(carrito, (newVal) => {
  localStorage.setItem("carritoCafe", JSON.stringify(newVal))
}, { deep: true })

const handleAddToCart = (producto) => {
  const existe = carrito.value.find(p => p.nombre === producto.nombre)
  if (existe) {
    existe.cantidad++
  } else {
    carrito.value.push({ ...producto, cantidad: 1 })
  }
  isCartOpen.value = true 
}
</script>

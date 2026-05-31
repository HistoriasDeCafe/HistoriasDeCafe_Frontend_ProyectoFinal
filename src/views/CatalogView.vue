<template>
  <main class="catalog-main">
    <div class="catalog-header">
      <h1 class="title">Nuestra Selección de Cafés</h1>
      <p class="subtitle">Descubre los mejores granos de café de origen seleccionado</p>
    </div>
    <section class="grid-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando nuestros cafés premium...</p>
      </div>
      <ProductCard
        v-else
        v-for="(prod, index) in listaCompleta"
        :key="prod.id || index"
        :producto="prod"
        @add-to-cart="agregarAlCarrito"
      />
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ProductCard from "../components/ProductCard.vue";
import Swal from 'sweetalert2';

const emit = defineEmits(['add-to-cart'])

const productosEstaticos = ref([]);

const productosBackend = ref([]);
const loading = ref(false);

const API_URL_PRODUCTS = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:8080/products"
  : "https://e-commerce-historias-de-cafe-backend.onrender.com/products";

const cargarProductosBackend = async () => {
  loading.value = true;
  try {
    const response = await fetch(API_URL_PRODUCTS);
    if (!response.ok) throw new Error("No se pudo obtener la lista de cafés del servidor.");
    
    const listaProductos = await response.json();
    
    productosBackend.value = listaProductos.map(prod => ({
      id: prod.idProduct || prod.id_product || prod.id,
      nombre: prod.name || "Café Premium",
      origen: prod.categoryName || "Región Origen",
      descripcion: prod.description || "Sin descripción disponible.",
      precio: prod.price || 0,
      imagen: prod.imagen || '/assets/img/iconoPepitaCafe-dark.svg'
    }));
  } catch (error) {
    console.error("Error cargando productos del backend:", error);
    Swal.fire({
      icon: 'warning',
      title: 'Usando catálogo local',
      text: 'No se pudo conectar con el servidor. Mostrando productos locales.',
      confirmButtonColor: '#532721',
      timer: 3000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarProductosBackend();
});

const listaCompleta = computed(() => {
  return productosBackend.value;
});

const agregarAlCarrito = (producto) => {
  console.log("Agregando:", producto.nombre);
  emit('add-to-cart', producto);
  
  Swal.fire({
    icon: 'success',
    iconColor: '#532721',
    title: '¡Producto agregado!',
    text: `${producto.nombre} se ha añadido a tu carretilla cafetera.`,
    confirmButtonColor: '#532721',
    timer: 2000,
    showConfirmButton: false
  });
};
</script>

<style scoped>
:root {
  --color-primary: #532721;
  --color-primary-active: #3d1c18;
  --color-secondary: #B08D57;
  --color-secondary-muted: rgba(176, 141, 87, 0.6);
  --color-accent: #5F6335;
  --color-background: #E4DBBF;
  --color-text-default: #1A1A1A;
  --color-border-default: #B08D57;
}

.catalog-main {
  min-height: 100vh;
  padding: 160px 20px 60px;
  background: linear-gradient(180deg, #f5f0eb 0%, #e8ddd0 100%);
}

.catalog-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

.title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 15px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--color-secondary);
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.3px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--color-primary);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(83, 39, 33, 0.1);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .catalog-main {
    padding: 100px 15px 40px;
  }
  
  .catalog-header {
    margin-bottom: 35px;
  }
  
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    padding: 0 10px;
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
}
</style>

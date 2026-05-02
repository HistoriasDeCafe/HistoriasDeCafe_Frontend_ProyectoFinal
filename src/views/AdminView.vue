<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <MenuAdmin v-model="activeView" />

    <main class="main-content">
      <header class="top-bar">
        <button class="toggle-btn"><i class="bi bi-list"></i></button>
        <span class="fw-bold">{{ activeView }}</span>
        <div class="user-info">🔔 👤</div>
      </header>

      <section class="content-padding" :class="animationClass">
        <div v-if="activeView === 'Dashboard'">
          <h2>Dashboard</h2>
          <p>Bienvenido de vuelta a Historias de Café</p>
          <div class="stats-grid">
            <div class="stat-card"><strong>$0</strong><span>Ventas</span></div>
            <div class="stat-card"><strong>0</strong><span>Órdenes</span></div>
            <div class="stat-card"><strong>{{ totalStockBajo }}</strong><span>Stock bajo</span></div>
          </div>

          <div class="table-section mt-4">
            <div class="table-header-container mb-4">
              <h3>Productos</h3>
              <button class="btn-cafe-admin" @click="showModal = true">
               <i class="bi bi-plus-circle me-2"></i> Añadir productos
              </button>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in listaProductos" :key="p.id">
                  <td>{{ p.nombre }}</td>
                  <td>${{ p.precio.toLocaleString() }}</td>
                  <td>{{ p.stock }}</td>
                  <td><span class="status-pill">{{ p.estado }}</span></td>
                  <td>
                    <button class="btn btn-sm">✏️</button>
                    <button class="btn btn-sm" @click="eliminar(p.id)">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <span class="close-btn" @click="showModal = false">&times;</span>
        <ProductForm @save="agregarNuevo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import MenuAdmin from '../components/MenuAdmin.vue';
import ProductForm from '../components/ProductForm.vue';

const activeView = ref('Dashboard');
const showModal = ref(false);
const listaProductos = ref([]);
const animationClass = ref('fade-in');

// Persistencia
onMounted(() => {
  const data = localStorage.getItem('productos');
  if (data) listaProductos.value = JSON.parse(data);
});

const agregarNuevo = (nuevoProd) => {
  listaProductos.value.push(nuevoProd);
  localStorage.setItem('productos', JSON.stringify(listaProductos.value));
  showModal.value = false;
};

const eliminar = (id) => {
  listaProductos.value = listaProductos.value.filter(p => p.id !== id);
  localStorage.setItem('productos', JSON.stringify(listaProductos.value));
};

const totalStockBajo = computed(() => listaProductos.value.filter(p => p.stock < 5).length);

// Animación SPA
watch(activeView, () => {
  animationClass.value = 'fade-out';
  setTimeout(() => animationClass.value = 'fade-in', 200);
});
</script>

<style scoped>
/* Aquí pegas el CSS de tu Admin (Stats, Table, Modal) */
.dashboard-container { display: flex; }
.main-content { flex: 1; background: #f4f4f4; }
.top-bar { background: white; padding: 15px 30px; display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; }
.content-padding { padding: 25px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
.stat-card { background: #fff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 20px; border-radius: 12px; width: 90%; max-width: 500px; position: relative; }
/* Estilo unificado para los botones de acción principal */
.btn-cafe-admin {
    background-color: #6f4e37; /* Tu color café principal */
    color: #ffffff;
    padding: 10px 20px;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-cafe-admin:hover {
    background-color: #532721; /* El marrón más oscuro que usas en el hover */
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-cafe-admin:active {
    transform: scale(0.98);
}

/* Ajuste opcional para el icono si usas Bootstrap Icons */
.btn-cafe-admin i {
    font-size: 1.1rem;
    margin-right: 8px;
}
</style>
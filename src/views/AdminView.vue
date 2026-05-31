<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <MenuAdmin v-model="activeView" />

    <main class="main-content">
      <header class="top-bar">
        <button class="toggle-btn"><i class="bi bi-list"></i></button>
        <span class="fw-bold">{{ activeView }}</span>
        <div class="user-info">👤</div>
      </header>

      <section class="content-padding" :class="animationClass">
        <!-- DASHBOARD VIEW - Muestra estadísticas -->
        <div v-if="activeView === 'Dashboard'">
          <div class="dashboard-header">
            <h2>Dashboard</h2>
            <p class="welcome-text">Bienvenido de vuelta a Historias de Café</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-currency-dollar"></i>
              </div>
              <strong>${{ totalVentas.toLocaleString() }}</strong>
              <span>Ventas Totales</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-receipt"></i>
              </div>
              <strong>{{ totalOrdenes }}</strong>
              <span>Órdenes Hoy</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-people"></i>
              </div>
              <strong>{{ totalUsuarios }}</strong>
              <span>Usuarios Activos</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <strong>{{ totalStockBajo }}</strong>
              <span>Stock Bajo</span>
            </div>
          </div>

          <div class="dashboard-widgets">
            <div class="widget-card">
              <h3><i class="bi bi-graph-up"></i> Actividad Reciente</h3>
              <div class="activity-list">
                <div class="activity-item">
                  <span class="activity-time">Hace 5 min</span>
                  <span class="activity-text">Nueva orden #1234</span>
                </div>
                <div class="activity-item">
                  <span class="activity-time">Hace 15 min</span>
                  <span class="activity-text">Usuario registrado</span>
                </div>
                <div class="activity-item">
                  <span class="activity-time">Hace 30 min</span>
                  <span class="activity-text">Producto actualizado</span>
                </div>
              </div>
            </div>

            <div class="widget-card">
              <h3><i class="bi bi-box-seam"></i> Productos Destacados</h3>
              <div class="featured-products">
                <div v-if="productosDestacados.length > 0">
                  <div v-for="(producto, index) in productosDestacados" :key="producto.id" class="featured-item">
                    <span>{{ producto.nombre }}</span>
                    <span class="badge" :class="index === 0 ? 'badge-top' : index === 1 ? 'badge-nuevo' : 'badge-popular'">
                      {{ index === 0 ? 'Top' : index === 1 ? 'Nuevo' : 'Popular' }}
                    </span>
                  </div>
                </div>
                <div v-else class="empty-featured">
                  <p>No hay productos destacados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PRODUCTOS VIEW - Muestra tabla de productos -->
        <div v-if="activeView === 'Productos'">
          <div class="table-section">
            <div class="table-header-container">
              <h3>Gestión de Productos</h3>
              <div style="font-size: 0.9rem; color: #666;">
                Total: {{ listaProductos.length }} productos | Página {{ currentPageProductos }} de {{ totalPaginasProductos }}
              </div>
              <button class="btn-cafe-admin" @click="showModal = true">
                <i class="bi bi-plus-circle"></i> Añadir Producto
              </button>
            </div>
            
            <div class="table-container">
              <table class="table table-expandable">
                <thead>
                  <tr>
                    <th class="text-left">Producto</th>
                    <th class="text-left">Origen</th>
                    <th class="text-left">Tostado</th>
                    <th class="text-left">Región</th>
                    <th class="text-right">Precio</th>
                    <th class="text-right">Stock</th>
                    <th class="text-center">Estado</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in productosPaginados" :key="p.id">
                    <td class="text-left">
                      <div class="product-cell">
                        <div class="product-name">{{ p.nombre }}</div>
                        <div class="product-desc" v-if="p.descripcion">{{ p.descripcion.substring(0, 50) }}{{ p.descripcion.length > 50 ? '...' : '' }}</div>
                      </div>
                    </td>
                    <td class="text-left">{{ p.origen }}</td>
                    <td class="text-left">{{ p.tostado }}</td>
                    <td class="text-left">{{ getRegionName(p.region) }}</td>
                    <td class="text-right">${{ p.precio.toLocaleString() }}</td>
                    <td class="text-right">{{ p.stock }}</td>
                    <td class="text-center">
                      <span class="status-pill" :class="p.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'">
                        {{ p.estado }}
                      </span>
                    </td>
                    <td class="text-center">
                      <div class="actions-wrapper">
                        <button class="btn-table-edit" @click="editarProducto(p)">
                          <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn-table-delete" @click="eliminar(p.id || p.id_product)">
                          <i class="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="listaProductos.length === 0" class="empty-state">
              <i class="bi bi-inbox"></i>
              <p>No hay productos registrados</p>
              <button class="btn-cafe-admin" @click="showModal = true">
                <i class="bi bi-plus-circle"></i> Agregar Primer Producto
              </button>
            </div>
            
            <!-- Paginación productos -->
            <div v-if="listaProductos.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ (currentPageProductos - 1) * itemsPerPageProductos + 1 }} - {{ Math.min(currentPageProductos * itemsPerPageProductos, listaProductos.length) }} de {{ listaProductos.length }} productos
              </div>
              <div class="pagination-controls">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPageProductos === 1"
                  @click="currentPageProductos--"
                >
                  <i class="bi bi-chevron-left"></i> Anterior
                </button>
                <span class="pagination-pages">
                  Página {{ currentPageProductos }} de {{ totalPaginasProductos }}
                </span>
                <button 
                  class="pagination-btn" 
                  :disabled="currentPageProductos === totalPaginasProductos"
                  @click="currentPageProductos++"
                >
                  Siguiente <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ORDENES VIEW -->
        <div v-if="activeView === 'Ordenes'">
          <div class="table-section">
            <div class="table-header-container">
              <h3>Gestión de Órdenes</h3>
              <div style="font-size: 0.9rem; color: #666;">
                Total: {{ listaOrdenes.length }} órdenes | Página {{ currentPageOrdenes }} de {{ totalPaginasOrdenes }}
              </div>
              <button class="btn-cafe-admin" @click="cargarOrdenesDesdeBackend">
                <i class="bi bi-arrow-clockwise"></i> Recargar
              </button>
            </div>
            
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-left">ID Orden</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Usuario ID</th>
                    <th class="text-center">Estado</th>
                    <th class="text-right">Subtotal</th>
                    <th class="text-right">Total</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="orden in ordenesPaginadas" :key="orden.id">
                    <td class="text-left">{{ orden.id }}</td>
                    <td class="text-left">{{ formatearFecha(orden.orderDate) }}</td>
                    <td class="text-left">{{ orden.userId }}</td>
                    <td class="text-center">
                      <span class="status-pill" :class="orden.stateOrder === 'Completada' ? 'badge-activo' : 'badge-inactivo'">
                        {{ orden.stateOrder }}
                      </span>
                    </td>
                    <td class="text-right">{{ formatearMoneda(orden.subtotal) }}</td>
                    <td class="text-right">{{ formatearMoneda(orden.total) }}</td>
                    <td class="text-center">
                      <div class="actions-wrapper">
                        <button class="btn-table-edit" @click="verDetallesOrden(orden)">
                          <i class="bi bi-eye"></i> Ver Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="listaOrdenes.length === 0" class="empty-state">
              <i class="bi bi-receipt"></i>
              <p>No hay órdenes registradas</p>
            </div>
            
            <!-- Paginación órdenes -->
            <div v-if="listaOrdenes.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ (currentPageOrdenes - 1) * itemsPerPageOrdenes + 1 }} - {{ Math.min(currentPageOrdenes * itemsPerPageOrdenes, listaOrdenes.length) }} de {{ listaOrdenes.length }} órdenes
              </div>
              <div class="pagination-controls">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPageOrdenes === 1"
                  @click="currentPageOrdenes--"
                >
                  <i class="bi bi-chevron-left"></i> Anterior
                </button>
                <span class="pagination-pages">
                  Página {{ currentPageOrdenes }} de {{ totalPaginasOrdenes }}
                </span>
                <button 
                  class="pagination-btn" 
                  :disabled="currentPageOrdenes === totalPaginasOrdenes"
                  @click="currentPageOrdenes++"
                >
                  Siguiente <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- USUARIOS VIEW -->
        <div v-if="activeView === 'Usuarios'">
          <div class="table-section">
            <div class="table-header-container">
              <h3>Gestión de Usuarios</h3>
              <button class="btn-cafe-admin" @click="openUserModal">
                <i class="bi bi-plus-circle"></i> Añadir Usuario
              </button>
            </div>
            
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-left">Nombre</th>
                    <th class="text-left">Email</th>
                    <th class="text-center">Rol</th>
                    <th class="text-center">Estado</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in usuariosPaginados" :key="u.id">
                    <td class="text-left">{{ u.nombre }}</td>
                    <td class="text-left">{{ u.email }}</td>
                    <td class="text-center">
                      <span class="status-pill" :class="u.rol === 'ADMIN' ? 'badge-activo' : 'badge-inactivo'">{{ u.rol || 'CLIENT' }}</span>
                    </td>
                    <td class="text-center">
                      <span class="status-pill" :class="u.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'">
                        {{ u.estado || 'activo' }}
                      </span>
                    </td>
                    <td class="text-center">
                      <div class="actions-wrapper">
                        <button class="btn-table-edit" @click="editarUsuario(u)">
                          <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn-table-delete" @click="eliminarUsuario(u.id)">
                          <i class="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="listaUsuarios.length === 0" class="empty-state">
              <i class="bi bi-people"></i>
              <p>No hay usuarios registrados</p>
              <button class="btn-cafe-admin" @click="openUserModal">
                <i class="bi bi-plus-circle"></i> Agregar Primer Usuario
              </button>
            </div>
            
            <!-- Paginación usuarios -->
            <div v-if="listaUsuarios.length > 0" class="pagination-container">
              <div class="pagination-info">
                Mostrando {{ (currentPageUsuarios - 1) * itemsPerPageUsuarios + 1 }} - {{ Math.min(currentPageUsuarios * itemsPerPageUsuarios, listaUsuarios.length) }} de {{ listaUsuarios.length }} usuarios
              </div>
              <div class="pagination-controls">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPageUsuarios === 1"
                  @click="currentPageUsuarios--"
                >
                  <i class="bi bi-chevron-left"></i> Anterior
                </button>
                <span class="pagination-pages">
                  Página {{ currentPageUsuarios }} de {{ totalPaginasUsuarios }}
                </span>
                <button 
                  class="pagination-btn" 
                  :disabled="currentPageUsuarios === totalPaginasUsuarios"
                  @click="currentPageUsuarios++"
                >
                  Siguiente <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CONFIGURACION VIEW -->
        <div v-if="activeView === 'Configuración'">
          <div class="empty-state">
            <i class="bi bi-gear"></i>
            <h3>Configuración</h3>
            <p>Próximamente</p>
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL PRODUCTO -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <ProductForm 
            :product-to-edit="productToEdit" 
            @save="handleProductSave" 
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>

    <!-- MODAL USUARIO -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isUserEditMode ? 'Editar Usuario' : 'Añadir Nuevo Usuario' }}</h3>
          <button class="close-btn" @click="closeUserModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUserSave">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" v-model="nuevoUsuario.nombre" required placeholder="Ingresa el nombre">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="nuevoUsuario.email" required placeholder="Ingresa el email">
            </div>
            <div class="form-group">
              <label>Contraseña {{ isUserEditMode ? '(dejar vacío para mantener actual)' : '' }}</label>
              <input type="password" v-model="nuevoUsuario.password" :required="!isUserEditMode" :placeholder="isUserEditMode ? 'Dejar vacío para mantener contraseña actual' : 'Ingresa la contraseña'">
            </div>
            <div class="form-group">
              <label>Rol</label>
              <select v-model="nuevoUsuario.rol">
                <option value="CLIENT">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div class="form-group" v-if="isUserEditMode">
              <label>Estado</label>
              <select v-model="nuevoUsuario.estado">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <button type="submit" class="btn-cafe-admin" style="width: 100%; margin-top: 20px;">
              <i class="bi bi-check-circle"></i> {{ isUserEditMode ? 'Actualizar Usuario' : 'Guardar Usuario' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- MODAL DETALLES DE ORDEN -->
    <div v-if="showOrderModal && ordenSeleccionada" class="modal-overlay" @click.self="closeOrderModal">
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h3>Detalles de Orden #{{ ordenSeleccionada.id }}</h3>
          <button class="close-btn" @click="closeOrderModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">ID Orden:</span>
              <span class="detail-value">{{ ordenSeleccionada.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fecha:</span>
              <span class="detail-value">{{ formatearFecha(ordenSeleccionada.orderDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Usuario ID:</span>
              <span class="detail-value">{{ ordenSeleccionada.userId }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <span class="detail-value">
                <span class="status-pill" :class="ordenSeleccionada.stateOrder === 'Completada' ? 'badge-activo' : 'badge-inactivo'">
                  {{ ordenSeleccionada.stateOrder }}
                </span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Subtotal:</span>
              <span class="detail-value">{{ formatearMoneda(ordenSeleccionada.subtotal) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total:</span>
              <span class="detail-value" style="font-weight: bold; font-size: 1.2rem;">{{ formatearMoneda(ordenSeleccionada.total) }}</span>
            </div>
            
            <hr style="margin: 1.5rem 0; border: none; height: 2px; background: linear-gradient(90deg, #e8e0d5 0%, #b08d57 50%, #e8e0d5 100%);">
            
            <h4 style="margin-bottom: 1rem; color: #532721;">Productos en la Orden</h4>
            <div v-if="ordenSeleccionada.details && ordenSeleccionada.details.length > 0">
              <div v-for="(detalle, index) in ordenSeleccionada.details" :key="index" class="product-detail-item">
                <div class="product-detail-info">
                  <span class="product-detail-label">Producto ID:</span>
                  <span class="product-detail-value">{{ detalle.productId }}</span>
                </div>
                <div class="product-detail-info">
                  <span class="product-detail-label">Cantidad:</span>
                  <span class="product-detail-value">{{ detalle.quantityProducts }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-details">
              <p>No hay detalles de productos disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import MenuAdmin from '../components/MenuAdmin.vue';
import ProductForm from '../components/ProductForm.vue';
import Swal from 'sweetalert2';

const activeView = ref('Dashboard');
const showModal = ref(false);
const showUserModal = ref(false);
const showOrderModal = ref(false);
const listaProductos = ref([]);
const listaUsuarios = ref([]);
const listaOrdenes = ref([]);
const listaPagos = ref([]);
const ordenSeleccionada = ref(null);
const animationClass = ref('fade-in');
const productToEdit = ref(null);
const isEditMode = ref(false);
const userToEdit = ref(null);
const isUserEditMode = ref(false);

// Paginación productos
const currentPageProductos = ref(1);
const itemsPerPageProductos = ref(5);

// Paginación usuarios
const currentPageUsuarios = ref(1);
const itemsPerPageUsuarios = ref(5);

// Paginación órdenes
const currentPageOrdenes = ref(1);
const itemsPerPageOrdenes = ref(5);

// Formulario de nuevo usuario
const nuevoUsuario = ref({
  nombre: '',
  email: '',
  password: '',
  rol: 'CLIENT',
  estado: 'activo'
});

// Usuario actual
const currentUser = ref(null);
const currentUserRole = ref('');

// Estadísticas del dashboard (ahora computed properties para datos reales)
const totalVentas = computed(() => {
  return listaOrdenes.value.reduce((sum, orden) => sum + (orden.total || 0), 0);
});

const totalOrdenes = computed(() => {
  return listaOrdenes.value.length;
});

const totalUsuarios = computed(() => {
  return listaUsuarios.value.length;
});

const totalStockBajo = computed(() => listaProductos.value.filter(p => p.stock < 5).length);

// Productos destacados (basados en datos reales)
const productosDestacados = computed(() => {
  // Ordenar por stock (menor stock = más vendido) y tomar los primeros 3
  return listaProductos.value
    .filter(p => p.estado === 'activo')
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3);
});

// Función para cargar usuarios desde backend
const cargarUsuariosDesdeBackend = async () => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const users = await response.json();
      listaUsuarios.value = users.map(u => ({
        id: u.id,
        nombre: u.name,
        email: u.email,
        rol: u.role,
        estado: u.stateActive ? 'activo' : 'inactivo'
      }));
      localStorage.setItem('usuarios', JSON.stringify(listaUsuarios.value));
      console.log('Usuarios recargados desde backend:', listaUsuarios.value.length);
    } else {
      // Fallback to localStorage if API fails
      const usersData = localStorage.getItem('usuarios');
      if (usersData) listaUsuarios.value = JSON.parse(usersData);
    }
  } catch (error) {
    console.error('Error recargando usuarios:', error);
    // Fallback to localStorage if API fails
    const usersData = localStorage.getItem('usuarios');
    if (usersData) listaUsuarios.value = JSON.parse(usersData);
  }
};

// Función para cargar órdenes desde backend
const cargarOrdenesDesdeBackend = async () => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const orders = await response.json();
      listaOrdenes.value = orders.map(o => ({
        id: o.id,
        userId: o.userId,
        stateOrder: o.stateOrder,
        subtotal: o.subtotal,
        total: o.total,
        orderDate: o.orderDate,
        details: o.details || []
      }));
      console.log('Órdenes cargadas desde backend:', listaOrdenes.value.length);
    } else {
      console.error('Error al cargar órdenes:', response.status);
      Swal.fire({
        icon: 'error',
        iconColor: '#d93025',
        title: 'Error al cargar órdenes',
        text: `No se pudieron cargar las órdenes. Status: ${response.status}`,
        confirmButtonColor: '#532721'
      });
    }
  } catch (error) {
    console.error('Error cargando órdenes:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor para cargar las órdenes.',
      confirmButtonColor: '#532721'
    });
  }
};

// Función para cargar pagos desde backend
const cargarPagosDesdeBackend = async () => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/payments`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const payments = await response.json();
      listaPagos.value = payments.map(p => ({
        id: p.id,
        orderId: p.orderId,
        transactionNumber: p.transactionNumber,
        transactionDate: p.transactionDate,
        transactionStatus: p.transactionStatus,
        paymentUrl: p.paymentUrl
      }));
      console.log('Pagos cargados desde backend:', listaPagos.value.length);
    } else {
      console.error('Error al cargar pagos:', response.status);
    }
  } catch (error) {
    console.error('Error cargando pagos:', error);
  }
};

// Función para cargar productos desde backend
const cargarProductosDesdeBackend = async () => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  try {
    const token = localStorage.getItem('authToken');
    console.log('Token presente:', !!token);
    console.log('Token valor:', token ? token.substring(0, 20) + '...' : 'N/A');
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Status de respuesta productos:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const products = await response.json();
      console.log('Respuesta cruda de API:', products);
      console.log('Número de productos:', products.length);
      
      if (products.length > 0) {
        console.log('Primer producto:', products[0]);
        console.log('Campos del primer producto:', Object.keys(products[0]));
      }
      
      listaProductos.value = products.map(p => ({
        id: p.idProduct || p.id_product || p.id,
        nombre: p.name || 'Sin nombre',
        origen: p.origin || p.origen || '',
        tostado: p.roast || p.tostado || '',
        region: p.categoryId || p.region || '',
        descripcion: p.description || '',
        precio: p.price || 0,
        stock: p.stock || 0,
        imagen: p.imagen || '',
        estado: 'activo'
      }));
      console.log('Productos mapeados:', listaProductos.value.length);
      console.log('Productos detallados:', listaProductos.value);
    } else {
      console.error('Error en respuesta de productos:', response.status, response.statusText);
      Swal.fire({
        icon: 'error',
        iconColor: '#d93025',
        title: 'Error al cargar productos',
        text: `No se pudieron cargar los productos. Status: ${response.status}`,
        confirmButtonColor: '#532721'
      });
    }
  } catch (error) {
    console.error('Error recargando productos:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor para cargar los productos.',
      confirmButtonColor: '#532721'
    });
  }
};

// Persistencia
onMounted(async () => {
  // Obtener usuario actual
  const user = localStorage.getItem('usuarioActivo');
  if (user) {
    currentUser.value = JSON.parse(user);
    currentUserRole.value = currentUser.value.role || 'CLIENT';
    console.log('Usuario actual:', currentUser.value);
    console.log('Rol del usuario:', currentUserRole.value);
  }
  
  // Verificar si el usuario tiene rol ADMIN
  if (currentUserRole.value !== 'ADMIN') {
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Acceso Denegado',
      text: 'No puedes acceder al dashboard de administrador.',
      confirmButtonColor: '#532721'
    }).then(() => {
      window.location.href = '/';
    });
    return;
  }
  
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  // Fetch products from API
  await cargarProductosDesdeBackend();

  // Fetch users from API
  await cargarUsuariosDesdeBackend();

  // Fetch orders from API
  await cargarOrdenesDesdeBackend();

  // Fetch payments from API
  await cargarPagosDesdeBackend();
});

const closeModal = () => {
  showModal.value = false;
  productToEdit.value = null;
  isEditMode.value = false;
};

const handleProductSave = async (productPayload) => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  const token = localStorage.getItem('authToken');
  const isEdit = productPayload.isEditMode;
  const productId = productPayload.id;

  console.log('Token JWT para productos:', token ? 'Token existe' : 'Token no existe');
  console.log('Rol del usuario actual:', currentUserRole.value);
  console.log('Modo:', isEdit ? 'Edición' : 'Creación');
  console.log('Payload del producto:', productPayload);

  try {
    let response;
    
    if (isEdit) {
      // UPDATE: PUT request
      response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productPayload.name,
          origen: productPayload.origin,
          tostado: productPayload.roast,
          description: productPayload.description,
          price: productPayload.price,
          stock: productPayload.stock,
          categoryId: productPayload.categoryId,
          imagen: productPayload.imagen
        })
      });
    } else {
      // CREATE: POST request
      response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productPayload.name,
          origen: productPayload.origin,
          tostado: productPayload.roast,
          description: productPayload.description,
          price: productPayload.price,
          stock: productPayload.stock,
          categoryId: productPayload.categoryId,
          imagen: productPayload.imagen
        })
      });
    }

    console.log('Response status productos:', response.status);
    console.log('Response ok productos:', response.ok);

    if (response.status === 401 || response.status === 403) {
      Swal.fire({
        icon: 'error',
        iconColor: '#d93025',
        title: 'Permisos insuficientes',
        text: 'Debes iniciar sesión con un usuario ADMIN para gestionar productos.',
        confirmButtonColor: '#532721'
      });
      return;
    }

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    const savedProduct = await response.json();
    
    // Recargar productos desde backend para asegurar consistencia
    await cargarProductosDesdeBackend();
    
    closeModal();
    
    if (isEdit) {
      Swal.fire({
        icon: 'success',
        iconColor: '#532721',
        title: '¡Producto Actualizado!',
        text: 'El producto ha sido actualizado exitosamente.',
        confirmButtonColor: '#B08D57',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'success',
        iconColor: '#532721',
        title: '¡Café Registrado!',
        text: 'El producto y su imagen en la nube se guardaron exitosamente.',
        confirmButtonColor: '#B08D57',
        timer: 2000,
        showConfirmButton: false
      });
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: error.message || 'No se pudo guardar el producto. Verifica que los campos cumplan las validaciones del backend.',
      confirmButtonColor: '#532721'
    });
  }
};

const editarProducto = (producto) => {
  console.log('Editar producto:', producto);
  console.log('Producto recibido ID:', producto.id);
  
  // Buscar el producto completo en la lista (manejar id, id_product, idProduct)
  const productoCompleto = listaProductos.value.find(p => p.id === producto.id || p.id === producto.id_product || p.id === producto.idProduct);
  
  console.log('Producto completo encontrado:', productoCompleto);
  
  if (productoCompleto) {
    // Mapear los datos al formato esperado por el formulario
    // Convertir tostado del backend al formato del select si es necesario
    let tostadoValue = productoCompleto.tostado || '';
    // Si el backend devuelve valores como 'TOSTADO_OSCURO', mantenerlos
    // Si devuelve valores como 'Oscuro', convertir a formato enum
    if (tostadoValue && !tostadoValue.startsWith('TOSTADO_')) {
      const tostadoMap = {
        'Oscuro': 'TOSTADO_OSCURO',
        'Medio': 'TOSTADO_MEDIO',
        'Claro': 'TOSTADO_CLARO'
      };
      tostadoValue = tostadoMap[tostadoValue] || tostadoValue;
    }
    
    productToEdit.value = {
      id: productoCompleto.id,
      nombre: productoCompleto.nombre,
      origen: productoCompleto.origen || '',
      tostado: tostadoValue,
      region: productoCompleto.region || '',
      stock: productoCompleto.stock,
      precio: productoCompleto.precio,
      descripcion: productoCompleto.descripcion || '',
      imagen: productoCompleto.imagen || ''
    };
    
    console.log('productToEdit.value establecido:', productToEdit.value);
    console.log('ID en productToEdit:', productToEdit.value.id);
    
    isEditMode.value = true;
    showModal.value = true;
  } else {
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: 'No se encontró el producto para editar.',
      confirmButtonColor: '#532721'
    });
  }
};

const eliminar = async (id) => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      listaProductos.value = listaProductos.value.filter(p => p.id !== id);
      localStorage.setItem('productos', JSON.stringify(listaProductos.value));
      Swal.fire({
        icon: 'success',
        iconColor: '#532721',
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado exitosamente',
        confirmButtonColor: '#532721',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      throw new Error(`Error del servidor: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#dc3545',
      title: 'Error',
      text: 'No se pudo eliminar el producto. Verifica tus permisos.',
      confirmButtonColor: '#532721'
    });
  }
};

const agregarUsuario = async () => {
  // API: POST /auth/register
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  const registerPayload = {
    name: nuevoUsuario.value.nombre.trim(),
    email: nuevoUsuario.value.email.trim(),
    password: nuevoUsuario.value.password,
    role: nuevoUsuario.value.rol
  };

  console.log('API URL:', API_URL);
  console.log('Register payload:', registerPayload);

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });

    if (response.status === 409) {
      Swal.fire({
        icon: 'info',
        iconColor: '#532721',
        title: 'Correo ya registrado',
        text: 'El correo ya está registrado',
        confirmButtonColor: '#532721'
      });
      return;
    }

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    const nuevoUsuarioCreado = await response.json();
    
    // Agregar a la lista local
    listaUsuarios.value.push({
      id: nuevoUsuarioCreado.id,
      nombre: nuevoUsuarioCreado.name,
      email: nuevoUsuarioCreado.email,
      rol: nuevoUsuarioCreado.role || nuevoUsuario.value.rol,
      estado: 'activo'
    });
    
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios.value));
    showUserModal.value = false;
    
    Swal.fire({
      icon: 'success',
      iconColor: '#532721',
      title: 'Usuario creado',
      text: 'El usuario ha sido creado exitosamente',
      confirmButtonColor: '#532721',
      timer: 2000,
      showConfirmButton: false
    });
    
    // Reset form
    nuevoUsuario.value = {
      nombre: '',
      email: '',
      password: '',
      rol: 'CLIENT',
      estado: 'activo'
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: 'Error al crear usuario. Inténtalo de nuevo.',
      confirmButtonColor: '#532721'
    });
  }
};

const editarUsuario = (usuario) => {
  console.log('Editar usuario:', usuario);
  
  // Buscar el usuario completo en la lista
  const usuarioCompleto = listaUsuarios.value.find(u => u.id === usuario.id);
  
  if (usuarioCompleto) {
    // Mapear los datos al formulario
    nuevoUsuario.value = {
      nombre: usuarioCompleto.nombre || '',
      email: usuarioCompleto.email || '',
      password: '', // Dejar vacío para mantener contraseña actual
      rol: usuarioCompleto.rol || 'CLIENT',
      estado: usuarioCompleto.estado || 'activo'
    };
    
    userToEdit.value = usuarioCompleto;
    isUserEditMode.value = true;
    showUserModal.value = true;
  } else {
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: 'No se encontró el usuario para editar.',
      confirmButtonColor: '#532721'
    });
  }
};

const openUserModal = () => {
  isUserEditMode.value = false;
  userToEdit.value = null;
  // Reset form for create mode
  nuevoUsuario.value = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENT',
    estado: 'activo'
  };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
  isUserEditMode.value = false;
  userToEdit.value = null;
  // Reset form
  nuevoUsuario.value = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENT',
    estado: 'activo'
  };
};

const handleUserSave = async () => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  const token = localStorage.getItem('authToken');
  const isEdit = isUserEditMode.value;
  const userId = userToEdit.value?.id;

  console.log('Token JWT para usuarios:', token ? 'Token existe' : 'Token no existe');
  console.log('Modo:', isEdit ? 'Edición' : 'Creación');
  console.log('Payload del usuario:', nuevoUsuario.value);

  try {
    let response;
    
    if (isEdit) {
      // UPDATE: PATCH request to /users/{id} (partial update)
      const updatePayload = {
        name: nuevoUsuario.value.nombre,
        email: nuevoUsuario.value.email,
        role: nuevoUsuario.value.rol,
        stateActive: nuevoUsuario.value.estado === 'activo'
      };
      // Solo incluir contraseña si se proporcionó una nueva
      if (nuevoUsuario.value.password) {
        updatePayload.passwordHash = nuevoUsuario.value.password;
      }
      
      response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });
    } else {
      // CREATE: POST request to /auth/register
      response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nuevoUsuario.value.nombre,
          email: nuevoUsuario.value.email,
          password: nuevoUsuario.value.password
        })
      });
    }

    console.log('Response status usuarios:', response.status);

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        iconColor: '#532721',
        title: isEdit ? '¡Usuario Actualizado!' : '¡Usuario Registrado!',
        text: isEdit ? 'El usuario se actualizó exitosamente.' : 'El usuario se registró exitosamente.',
        confirmButtonColor: '#B08D57',
        timer: 2000,
        showConfirmButton: false
      });
      
      closeUserModal();
      // Recargar usuarios desde backend
      await cargarUsuariosDesdeBackend();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: error.message || 'No se pudo guardar el usuario. Verifica que los campos cumplan las validaciones del backend.',
      confirmButtonColor: '#532721'
    });
  }
};

const eliminarUsuario = async (id) => {
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  // Obtener token JWT del localStorage
  const token = localStorage.getItem('authToken');
  console.log('Token JWT:', token ? 'Token existe' : 'Token no existe');
  console.log('Rol del usuario actual:', currentUserRole.value);
  
  // Verificar si el usuario tiene permisos de ADMIN
  if (currentUserRole.value !== 'ADMIN') {
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Permisos insuficientes',
      text: 'Solo los administradores pueden desactivar usuarios.',
      confirmButtonColor: '#532721'
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stateActive: false })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      // Actualizar estado local
      const userIndex = listaUsuarios.value.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        listaUsuarios.value[userIndex].estado = 'inactivo';
        localStorage.setItem('usuarios', JSON.stringify(listaUsuarios.value));
      }
      Swal.fire({
        icon: 'success',
        iconColor: '#532721',
        title: 'Usuario desactivado',
        text: 'El usuario ha sido desactivado exitosamente',
        confirmButtonColor: '#532721',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      Swal.fire({
        icon: 'error',
        iconColor: '#d93025',
        title: 'Error',
        text: `Error al desactivar usuario (${response.status}). Verifica tus permisos.`,
        confirmButtonColor: '#532721'
      });
    }
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: 'Error al desactivar usuario. Inténtalo de nuevo.',
      confirmButtonColor: '#532721'
    });
  }
};

// Helper function to get region name from ID
const getRegionName = (regionId) => {
  const regions = {
    '1': 'Andina',
    '2': 'Caribe',
    '3': 'Pacífica',
    '4': 'Orinoquía',
    '5': 'Amazonía'
  };
  return regions[regionId] || regionId || '-';
};

// Computed para productos paginados
const productosPaginados = computed(() => {
  const start = (currentPageProductos.value - 1) * itemsPerPageProductos.value;
  const end = start + itemsPerPageProductos.value;
  const paginated = listaProductos.value.slice(start, end);
  console.log('Productos totales:', listaProductos.value.length);
  console.log('Página actual:', currentPageProductos.value);
  console.log('Productos paginados:', paginated.length);
  return paginated;
});

const totalPaginasProductos = computed(() => {
  return Math.ceil(listaProductos.value.length / itemsPerPageProductos.value);
});

// Computed para usuarios paginados
const usuariosPaginados = computed(() => {
  const start = (currentPageUsuarios.value - 1) * itemsPerPageUsuarios.value;
  const end = start + itemsPerPageUsuarios.value;
  return listaUsuarios.value.slice(start, end);
});

const totalPaginasUsuarios = computed(() => {
  return Math.ceil(listaUsuarios.value.length / itemsPerPageUsuarios.value);
});

// Computed para órdenes paginados
const ordenesPaginadas = computed(() => {
  const start = (currentPageOrdenes.value - 1) * itemsPerPageOrdenes.value;
  const end = start + itemsPerPageOrdenes.value;
  return listaOrdenes.value.slice(start, end);
});

const totalPaginasOrdenes = computed(() => {
  return Math.ceil(listaOrdenes.value.length / itemsPerPageOrdenes.value);
});

// Helper para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  const date = new Date(fecha);
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper para formatear moneda
const formatearMoneda = (monto) => {
  if (monto === null || monto === undefined) return '-';
  return Number(monto).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// Función para ver detalles de orden
const verDetallesOrden = (orden) => {
  ordenSeleccionada.value = orden;
  showOrderModal.value = true;
};

// Función para cerrar modal de orden
const closeOrderModal = () => {
  showOrderModal.value = false;
  ordenSeleccionada.value = null;
};

// Animación SPA
watch(activeView, () => {
  animationClass.value = 'fade-out';
  setTimeout(() => animationClass.value = 'fade-in', 200);
});
</script>

<style scoped>
/* ==================== VARIABLES LOCALES ==================== */
:root {
  --bg-main: #f4f4f4;
  --accent: #6f4e37;
  --text-dark: #333;
}

/* ==================== ESTILOS GENERALES ==================== */
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-main);
}

.top-bar {
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-primary, #532721);
  padding: 5px;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: var(--color-secondary, #B08D57);
}

.content-padding {
  padding: 25px;
}

/* ==================== DASHBOARD HEADER ==================== */
.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-family: "Playfair Display", serif;
  color: var(--color-primary, #532721);
  font-size: 2rem;
  margin: 0 0 10px 0;
}

.welcome-text {
  color: var(--text-dark, #333);
  font-size: 1.1rem;
  margin: 0;
}

/* ==================== ANIMACIONES ==================== */
.fade-out {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* ==================== TARJETAS DE ESTADÍSTICAS ==================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: #d9d9d9;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 2rem;
  color: var(--color-secondary, #B08D57);
  margin-bottom: 5px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card strong {
  display: block;
  font-size: 1.5rem;
  color: var(--color-primary, #532721);
  margin-bottom: 5px;
}

.stat-card span {
  font-size: 0.9rem;
  color: var(--text-dark, #333);
  font-weight: 500;
}

/* ==================== SECCIÓN DE LA TABLA PREMIUM ==================== */
.table-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(83, 39, 33, 0.05);
}

.table-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f4f0ea;
}

.table-header-container h3 {
  font-family: "Playfair Display", serif;
  color: var(--color-primary, #532721);
  margin: 0;
  font-size: 1.4rem;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 5px;
}

.table th {
  background-color: #fcfbfa;
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px;
  border-bottom: 2px solid #eaddca;
}

.table td {
  padding: 16px;
  color: var(--color-text-default, #333);
  font-size: 0.95rem;
  border-bottom: 1px solid #f4f0ea;
  vertical-align: middle;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover td {
  background-color: #fdfbf7;
}

/* Clases de alineación de datos */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Badges de Estado del Producto */
.status-pill {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-activo {
  background-color: #e6f4ea;
  color: #137333;
}

.badge-inactivo {
  background-color: #f1f3f4;
  color: #5f6368;
}

/* Estilos para detalles de orden en modal */
.order-details {
  padding: 10px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f4f0ea;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #532721;
  font-size: 0.95rem;
}

.detail-value {
  color: #333;
  font-size: 0.95rem;
}

.product-detail-item {
  background-color: #f9f7f4;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid #e8e0d5;
}

.product-detail-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.product-detail-info:last-child {
  margin-bottom: 0;
}

.product-detail-label {
  font-weight: 600;
  color: #532721;
  font-size: 0.9rem;
}

.product-detail-value {
  color: #333;
  font-size: 0.9rem;
}

.empty-details {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

/* Estilos para productos destacados */
.empty-featured {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.featured-item .badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-top {
  background-color: #ffd700;
  color: #333;
}

.badge-nuevo {
  background-color: #4caf50;
  color: white;
}

.badge-popular {
  background-color: #2196f3;
  color: white;
}

/* Botones de acción dentro de la tabla */
.actions-wrapper {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-table-edit, .btn-table-delete {
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-table-edit {
  background-color: #fbf5ee;
  color: var(--color-secondary, #B08D57);
}

.btn-table-edit:hover {
  background-color: var(--color-secondary, #B08D57);
  color: white;
}

.btn-table-delete {
  background-color: #fdebee;
  color: #d93025;
}

.btn-table-delete:hover {
  background-color: #d93025;
  color: white;
}

/* ==================== PRODUCT CELL STYLES ==================== */
.product-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 600;
  color: var(--color-text-default, #333);
  font-size: 0.95rem;
}

.product-desc {
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
  line-height: 1.3;
}

/* ==================== EXPANDED TABLE STYLES ==================== */
.table-expandable {
  font-size: 0.9rem;
}

.table-expandable th {
  font-size: 0.8rem;
  padding: 12px 10px;
}

.table-expandable td {
  padding: 12px 10px;
  font-size: 0.85rem;
}

/* Responsive table for smaller screens */
@media (max-width: 1200px) {
  .table-expandable th:nth-child(4),
  .table-expandable td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 992px) {
  .table-expandable th:nth-child(3),
  .table-expandable td:nth-child(3) {
    display: none;
  }
}

@media (max-width: 768px) {
  .table-expandable {
    font-size: 0.8rem;
  }
  
  .table-expandable th,
  .table-expandable td {
    padding: 8px 6px;
  }
  
  .product-name {
    font-size: 0.85rem;
  }
  
  .product-desc {
    display: none;
  }
  
  .actions-wrapper {
    flex-direction: column;
    gap: 4px;
  }
  
  .btn-table-edit,
  .btn-table-delete {
    padding: 6px 8px;
    font-size: 0.75rem;
  }
}

/* ==================== BOTÓN AÑADIR PRODUCTO ==================== */
.btn-cafe-admin {
  background-color: #6F4E37;
  color: #ffffff;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  width: fit-content;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-cafe-admin:hover {
  background-color: #5d4037;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-cafe-admin:active {
  transform: translateY(0);
}

.btn-cafe-admin i {
  font-size: 1.1rem;
}

/* ==================== VENTANAS MODALES ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInOverlay 0.3s ease-out;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 550px;
  margin: 5% auto;
  padding: 0;
  border-radius: 16px;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, var(--color-primary, #532721) 0%, var(--color-secondary, #B08D57) 100%);
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-family: "Playfair Display", serif;
  color: white;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
}

/* ==================== FORMULARIOS ==================== */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-primary, #532721);
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-secondary, #B08D57);
  background: white;
  box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.1);
}

.form-group input::placeholder {
  color: #999;
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23532721' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 40px;
}

/* ==================== PAGINACIÓN ==================== */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  background: var(--color-primary, #532721);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-primary-active, #3d1c18);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-pages {
  font-size: 0.9rem;
  color: var(--color-primary, #532721);
  font-weight: 600;
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { 
    transform: translateY(-30px) scale(0.95); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
}

/* ==================== DASHBOARD WIDGETS ==================== */
.dashboard-widgets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.widget-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.widget-card h3 {
  font-family: "Playfair Display", serif;
  color: var(--color-primary, #532721);
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.widget-card h3 i {
  color: var(--color-secondary, #B08D57);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

.activity-text {
  font-size: 0.9rem;
  color: var(--text-dark, #333);
}

.featured-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.featured-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.featured-item .badge {
  background: var(--color-secondary, #B08D57);
  color: white;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* ==================== EMPTY STATE ==================== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  color: var(--color-secondary, #B08D57);
  margin-bottom: 20px;
}

.empty-state h3 {
  font-family: "Playfair Display", serif;
  color: var(--color-primary, #532721);
  margin: 0 0 10px 0;
}

.empty-state p {
  margin: 0 0 20px 0;
}

/* ==================== TABLE CONTAINER ==================== */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-widgets {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-widgets {
    grid-template-columns: 1fr;
  }
  
  .table-section {
    padding: 16px;
  }
  
  .table {
    font-size: 0.85rem;
  }
  
  .table th, .table td {
    padding: 10px 8px;
  }
  
  .btn-cafe-admin {
    width: 100%;
    justify-content: center;
  }
  
  .table-header-container {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .dashboard-header h2 {
    font-size: 1.5rem;
  }
}
</style>
<template>
  <div>
    <!-- Fondo oscuro detrás del carrito -->
    <div 
      class="carrito-overlay" 
      :class="{ activo: isOpen }" 
      @click="$emit('close')"
    ></div>

    <!-- Panel lateral derecho -->
    <aside class="carrito-sidebar" :class="{ abierto: isOpen }">
      <div class="carrito-header">
        <h2>Carretilla Cafetera</h2>
        <button class="btn-cerrar" @click="$emit('close')">&times;</button>
      </div>

      <div class="carrito-tabla-header">
        <span>Producto</span>
        <span>Cantidad</span>
        <span>Total</span>
      </div>

      <div class="carrito-body">
        <!-- Mensaje si está vacío -->
        <div v-if="items.length === 0" class="carrito-vacio">
          <div class="carrito-vacio-icono">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <p class="carrito-vacio-texto">Tu carretilla está vacía</p>
          <p class="carrito-vacio-subtexto">Descubre nuestros cafés premium</p>
        </div>

        <!-- Lista dinámica de items -->
        <div v-for="item in items" :key="item.nombre" class="carrito-item">
          <div class="prod-info">
            <div class="prod-img-placeholder">
              <img :src="item.imagen" :alt="item.nombre">
            </div>
            <div class="prod-detalles">
              <p class="prod-nombre">{{ item.nombre }}</p>
              <button class="btn-eliminar" @click="eliminarItem(item.nombre)" title="Eliminar producto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Eliminar</span>
              </button>
            </div>
          </div>

          <div class="prod-cantidad">
            <div class="control-cantidad">
              <button @click="updateQty(item.nombre, -1)">−</button>
              <span class="item-cantidad">{{ item.cantidad }}</span>
              <button @click="updateQty(item.nombre, 1)">+</button>
            </div>
          </div>

          <div class="prod-total item-subtotal">
            ${{ (item.precio * item.cantidad).toLocaleString('es-CO') }}
          </div>
        </div>
      </div>

      <div class="carrito-footer">
        <p class="conteo-productos">{{ totalItems }} productos</p>
        <div class="notas-pedido">
          <label>Agregar notas al pedido</label>
          <textarea v-model="notas" rows="2" placeholder="Especifica instrucciones especiales (ej. agregar como regalo, notas de entrega, etc.)"></textarea>
        </div>
        <hr>
        <div class="subtotal-section">
          <span>Subtotal:</span>
          <strong id="subtotal-valor">${{ subtotal.toLocaleString('es-CO') }}</strong>
        </div>
        <button class="btn-pagar" @click="irAPagar">
          <span>Procesar Pedido</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps(['isOpen', 'items']);
const emit = defineEmits(['close', 'update-cart']);
const notas = ref("");

const totalItems = computed(() => props.items.reduce((acc, i) => acc + i.cantidad, 0));
const subtotal = computed(() => props.items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));

const updateQty = (nombre, cambio) => {
  const nuevosItems = props.items.map(item => {
    if (item.nombre === nombre) {
      const nuevaC = item.cantidad + cambio;
      return (nuevaC > 0 && nuevaC <= 99) ? { ...item, cantidad: nuevaC } : item;
    }
    return item;
  });
  emit('update-cart', nuevosItems);
};

const eliminarItem = (nombre) => {
  emit('close');
  Swal.fire({
    title: "¿Eliminar producto?",
    html: `¿Deseas quitar <strong>${nombre}</strong> del carrito?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    customClass: {
      popup: 'swal2-popup-cart',
      container: 'swal2-container-cart',
      title: 'swal2-title-cart',
      htmlContainer: 'swal2-html-container-cart'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const filtrados = props.items.filter(i => i.nombre !== nombre);
      emit('update-cart', filtrados);
    }
  });
};

const irAPagar = async () => {
  // Validación: Carrito vacío
  if (props.items.length === 0) {
    return Swal.fire({
      icon: 'info',
      iconColor: '#532721',
      title: '¡Tu carretilla está vacía!',
      text: 'Agrega algunos cafés premium antes de procesar tu pedido.',
      confirmButtonColor: '#532721',
      timer: 2400,
      showConfirmButton: false
    });
  }

  try {
    // Cerrar carrito al inicio del proceso
    emit('close');

    // Paso 1: Validar autenticación
    const token = localStorage.getItem("authToken");
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    console.log('[PAYMENT_FLOW] Iniciando proceso de pago');
    console.log('[PAYMENT_FLOW] Token presente:', !!token);
    console.log('[PAYMENT_FLOW] Usuario activo presente:', !!usuarioActivo);

    if (!token) {
      console.error('[PAYMENT_FLOW] Error: Token de autenticación ausente');
      return Swal.fire({
        icon: 'warning',
        iconColor: '#532721',
        title: 'Sesión requerida',
        text: 'No hay token de autenticación. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#532721'
      });
    }

    if (!usuarioActivo) {
      console.error('[PAYMENT_FLOW] Error: Información de usuario ausente');
      return Swal.fire({
        icon: 'warning',
        iconColor: '#532721',
        title: 'Sesión requerida',
        text: 'No hay información de usuario. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#532721'
      });
    }

    const userData = JSON.parse(usuarioActivo);
    const userId = userData.id || userData.idUser;

    console.log('[PAYMENT_FLOW] Datos del usuario:', userData);
    console.log('[PAYMENT_FLOW] Rol del usuario:', userData.role || userData.rol || 'No especificado');

    if (!userId) {
      console.error('[PAYMENT_FLOW] Error: ID de usuario no encontrado en userData', userData);
      return Swal.fire({
        icon: 'warning',
        iconColor: '#532721',
        title: 'Datos de usuario incompletos',
        text: 'La información de usuario no contiene un ID válido. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#532721'
      });
    }

    // Paso 2: Preparar detalles de la orden (OrderDetailRequestDto)
    const details = props.items.map(item => {
      const productId = Number(item.id || item.id_product || item.idProduct || 1);
      console.log('[PAYMENT_FLOW] Item:', item.nombre, 'ID enviado:', productId, 'ID original:', item.id, 'id_product:', item.id_product, 'idProduct:', item.idProduct);
      return {
        productId: productId,
        quantityProducts: Number(item.cantidad)
      };
    });

    console.log('[PAYMENT_FLOW] Detalles de la orden:', details);

    // Validar que todos los detalles tengan la estructura correcta
    const invalidDetails = details.filter(d => 
      !d.productId || !d.quantityProducts || d.quantityProducts <= 0
    );

    if (invalidDetails.length > 0) {
      console.error('[PAYMENT_FLOW] Error: Detalles inválidos', invalidDetails);
      throw new Error('Hay productos con información inválida en el carrito');
    }

    // Paso 3: Mostrar loading
    Swal.fire({
      title: 'Procesando tu pedido...',
      text: 'Creando orden en el sistema',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Paso 4: Configurar API URL y headers
    const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:8080"
      : "https://e-commerce-historias-de-cafe-backend.onrender.com";

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Paso 5: Crear orden (OrderRequestDto: userId, stateOrder, details)
    const orderPayload = {
      userId: userId,
      stateOrder: "En proceso",
      details: details
    };

    console.log('[PAYMENT_FLOW] Enviando OrderRequestDto:', orderPayload);
    console.log('[PAYMENT_FLOW] Endpoint:', `${API_URL}/orders`);

    const orderResponse = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(orderPayload)
    });

    console.log('[PAYMENT_FLOW] Respuesta orden - Status:', orderResponse.status);

    // Manejar errores específicos de la orden
    if (orderResponse.status === 401) {
      console.error('[PAYMENT_FLOW] Error 401: No autorizado');
      Swal.close();
      return Swal.fire({
        icon: 'error',
        iconColor: '#dc3545',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#532721'
      });
    }

    if (orderResponse.status === 403) {
      console.error('[PAYMENT_FLOW] Error 403: Prohibido - Usuario sin permisos para crear órdenes');
      console.error('[PAYMENT_FLOW] Usuario ID:', userId);
      console.error('[PAYMENT_FLOW] Rol:', userData.role || userData.rol || 'No especificado');
      Swal.close();
      return Swal.fire({
        icon: 'error',
        iconColor: '#dc3545',
        title: 'Sin permisos para crear órdenes',
        html: `Tu cuenta (ID: ${userId}) con rol <strong>${userData.role || userData.rol || 'No especificado'}</strong> no tiene permisos para crear órdenes de compra.<br><br>El rol <strong>CLIENT</strong> debería tener permisos para crear órdenes. Por favor, verifica la configuración de seguridad en el backend (SecurityConfig) para asegurar que el rol CLIENT tenga acceso al endpoint POST /orders.`,
        confirmButtonColor: '#532721',
        width: '550px'
      });
    }

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('[PAYMENT_FLOW] Error en creación de orden:', errorText);
      throw new Error(`Error al crear la orden: ${orderResponse.status} - ${errorText}`);
    }

    // Paso 6: Procesar respuesta de la orden (OrderResponseDto)
    const orderData = await orderResponse.json();
    console.log('[PAYMENT_FLOW] OrderResponseDto recibido:', orderData);

    const nuevoOrderId = orderData.id;
    
    if (!nuevoOrderId) {
      console.error('[PAYMENT_FLOW] Error: OrderResponseDto no contiene ID', orderData);
      throw new Error('La respuesta del servidor no contiene un ID de orden válido');
    }

    console.log('[PAYMENT_FLOW] Orden creada exitosamente con ID:', nuevoOrderId);

    // Paso 7: Actualizar loading para pago
    Swal.update({
      title: 'Configurando pago...',
      text: 'Conectando con la pasarela de pago segura'
    });

    // Paso 8: Crear preferencia de pago (PaymentRequestDto: orderId)
    const paymentPayload = {
      orderId: nuevoOrderId
    };

    console.log('[PAYMENT_FLOW] Enviando PaymentRequestDto:', paymentPayload);
    console.log('[PAYMENT_FLOW] Endpoint:', `${API_URL}/payments`);

    const paymentResponse = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(paymentPayload)
    });

    console.log('[PAYMENT_FLOW] Respuesta pago - Status:', paymentResponse.status);

    // Manejar errores específicos del pago
    if (paymentResponse.status === 401) {
      console.error('[PAYMENT_FLOW] Error 401: No autorizado en pago');
      Swal.close();
      return Swal.fire({
        icon: 'error',
        iconColor: '#dc3545',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado durante el proceso de pago. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#532721'
      });
    }

    if (paymentResponse.status === 403) {
      console.error('[PAYMENT_FLOW] Error 403: Prohibido en pago');
      Swal.close();
      return Swal.fire({
        icon: 'error',
        iconColor: '#dc3545',
        title: 'Sin permisos',
        text: 'No tienes los permisos necesarios para procesar el pago.',
        confirmButtonColor: '#532721'
      });
    }

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('[PAYMENT_FLOW] Error en creación de pago:', errorText);
      throw new Error(`Error al crear la preferencia de pago: ${paymentResponse.status} - ${errorText}`);
    }

    // Paso 9: Procesar respuesta del pago (PaymentResponseDto)
    const paymentData = await paymentResponse.json();
    console.log('[PAYMENT_FLOW] PaymentResponseDto recibido:', paymentData);

    const paymentUrl = paymentData.paymentUrl;
    
    if (!paymentUrl) {
      console.error('[PAYMENT_FLOW] Error: PaymentResponseDto no contiene paymentUrl', paymentData);
      throw new Error('La respuesta del servidor no contiene una URL de pago válida');
    }

    console.log('[PAYMENT_FLOW] URL de pago obtenida:', paymentUrl);
    console.log('[PAYMENT_FLOW] Redirigiendo a pasarela de pago...');

    // Paso 10: Cerrar carrito y redirigir a la pasarela de pago
    Swal.close();
    emit('close');
    window.location.href = paymentUrl;

  } catch (error) {
    console.error('[PAYMENT_FLOW] Error no manejado:', error);
    Swal.fire({
      icon: 'error',
      iconColor: '#dc3545',
      title: 'Error al procesar el pedido',
      text: error.message || 'No se pudo procesar tu compra de café. Por favor, inténtalo de nuevo.',
      confirmButtonColor: '#532721'
    });
  }
}; 

</script>


<style scoped>

/* ==================== OVERLAY ==================== */
.carrito-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1040;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carrito-overlay.activo {
  display: block;
  opacity: 1;
}


/* ==================== SIDEBAR ==================== */
.carrito-sidebar {
  position: fixed;
  top: 0;
  right: -520px;
  width: 500px;
  max-width: 95vw;
  height: 100vh;
  background: linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%);
  box-shadow: -8px 0 32px rgba(83, 39, 33, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1050;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-family-body, "Source Sans 3", sans-serif);
}

.carrito-sidebar.abierto {
  right: 0 !important;
  display: flex !important;
  z-index: 9999 !important;
  box-shadow: -12px 0 40px rgba(83, 39, 33, 0.2);
}

.carrito-overlay.activo {
  display: block !important;
  z-index: 9998 !important;
}


/* ==================== HEADER ==================== */
.carrito-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #532721 0%, #3e1f1a 100%);
  color: #fff;
  box-shadow: 0 2px 12px rgba(83, 39, 33, 0.2);
}

.carrito-header h2 {
  font-family: var(--font-family-display, "Playfair Display", serif);
  font-size: 1.35rem;
  margin: 0;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.btn-cerrar {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cerrar:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}


/* ==================== TABLA HEADER ==================== */
.carrito-tabla-header {
  display: grid;
  grid-template-columns: 3.5fr 1fr 1fr;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #b08d57 0%, #8b6f47 100%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(176, 141, 87, 0.25);
}


/* ==================== BODY ==================== */
.carrito-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: #fff;
}

.carrito-body::-webkit-scrollbar {
  width: 6px;
}

.carrito-body::-webkit-scrollbar-track {
  background: #f5f0e8;
}

.carrito-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #b08d57 0%, #8b6f47 100%);
  border-radius: 6px;
}

.carrito-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #8b6f47 0%, #6b5537 100%);
}


/* ==================== EMPTY STATE ==================== */
.carrito-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1.5rem;
}

.carrito-vacio-icono {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(176, 141, 87, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%);
  border-radius: 50%;
  color: #b08d57;
  margin-bottom: 0.5rem;
}

.carrito-vacio-texto {
  font-size: 1.15rem;
  font-weight: 600;
  color: #532721;
  margin: 0;
  font-family: var(--font-family-display, "Playfair Display", serif);
}

.carrito-vacio-subtexto {
  font-size: 1rem;
  color: #8b7355;
  margin: 0;
}


/* ==================== CART ITEM ==================== */
.carrito-item {
  display: grid;
  grid-template-columns: 3.5fr 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e8e0d5;
  transition: all 0.2s ease;
  background: #fff;
  min-height: 120px;
}

.carrito-item:hover {
  background: linear-gradient(90deg, rgba(176, 141, 87, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.carrito-item:last-child {
  border-bottom: none;
}


/* ==================== PRODUCT INFO ==================== */
.prod-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
}

.prod-img-placeholder {
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d5 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.prod-img-placeholder:hover {
  transform: scale(1.05);
}

.prod-img-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-detalles {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.prod-detalles p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #3e2723;
  line-height: 1.4;
  padding-right: 0.5rem;
}

.btn-eliminar {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%);
  border: 1px solid rgba(220, 53, 69, 0.25);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  color: #dc3545;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  align-self: flex-start;
  flex-shrink: 0;
}

.btn-eliminar:hover {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.2) 0%, rgba(220, 53, 69, 0.1) 100%);
  border-color: rgba(220, 53, 69, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(220, 53, 69, 0.2);
}

.btn-eliminar svg {
  transition: transform 0.2s ease;
}

.btn-eliminar:hover svg {
  transform: scale(1.1);
}


/* ==================== PRICE ==================== */
.prod-precio {
  font-size: 1rem;
  font-weight: 600;
  color: #532721;
  text-align: center;
}


/* ==================== QUANTITY ==================== */
.prod-cantidad {
  display: flex;
  justify-content: center;
}

.control-cantidad {
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #e8e0d5;
  border-radius: 10px;
  padding: 0;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.control-cantidad:hover {
  border-color: #b08d57;
  box-shadow: 0 4px 12px rgba(176, 141, 87, 0.15);
}

.control-cantidad button {
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d5 100%);
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  color: #532721;
  padding: 0.5rem 0.75rem;
  line-height: 1;
  transition: all 0.2s ease;
  min-width: 36px;
}

.control-cantidad button:hover {
  background: linear-gradient(135deg, #b08d57 0%, #8b6f47 100%);
  color: #fff;
  transform: scale(1.05);
}

.control-cantidad button:active {
  transform: scale(0.95);
}

.item-cantidad {
  font-size: 0.95rem;
  font-weight: 700;
  min-width: 2rem;
  text-align: center;
  color: #3e2723;
  padding: 0 0.5rem;
}


/* ==================== TOTAL ==================== */
.prod-total,
.item-subtotal {
  font-size: 0.95rem;
  font-weight: 700;
  color: #532721;
  text-align: right;
}


/* ==================== FOOTER ==================== */
.carrito-footer {
  padding: 1.5rem;
  border-top: 2px solid #e8e0d5;
  background: linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.conteo-productos {
  font-size: 0.85rem;
  color: #8b7355;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.conteo-productos::before {
  content: '';
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #b08d57 0%, #8b6f47 100%);
  border-radius: 50%;
}

.notas-pedido {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.notas-pedido label {
  font-size: 0.8rem;
  color: #532721;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.notas-pedido textarea {
  resize: vertical;
  border: 2px solid #e8e0d5;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: var(--font-family-body, sans-serif);
  background: #fff;
  color: #3e2723;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.notas-pedido textarea:focus {
  outline: none;
  border-color: #b08d57;
  box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.15);
}

.notas-pedido textarea::placeholder {
  color: #a89878;
}

.carrito-footer hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #e8e0d5 0%, #b08d57 50%, #e8e0d5 100%);
  margin: 1.5rem 0;
}

.subtotal-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 1.5rem;
  font-size: 1rem;
}

.subtotal-section span {
  color: #532721;
  font-weight: 700;
  font-size: 1.1rem;
}

.subtotal-section strong {
  color: #532721;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #532721 0%, #3e1f1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-pagar {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #532721 0%, #3e1f1a 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-family-display, serif);
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(83, 39, 33, 0.3);
}

.btn-pagar:hover {
  background: linear-gradient(135deg, #6b3329 0%, #4d2620 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(83, 39, 33, 0.4);
}

.btn-pagar:active {
  transform: translateY(0);
}

.btn-pagar svg {
  transition: transform 0.2s ease;
}

.btn-pagar:hover svg {
  transform: translateX(3px);
}


/* ==================== RESPONSIVE ==================== */
@media (max-width: 480px) {
  .carrito-sidebar {
    width: 100vw;
    right: -100vw;
  }

  .carrito-tabla-header,
  .carrito-item {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .carrito-header {
    padding: 1rem 1.25rem;
  }

  .carrito-header h2 {
    font-size: 1.15rem;
  }

  .carrito-item {
    padding: 0.85rem 1rem;
    gap: 0.5rem;
  }

  .prod-img-placeholder {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }

  .carrito-footer {
    padding: 1.25rem;
  }
}

@media (max-width: 768px) {
  .carrito-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .prod-info {
    width: 100%;
  }

  .prod-cantidad,
  .prod-total,
  .prod-precio {
    width: 100%;
    text-align: left;
  }

  .control-cantidad {
    justify-content: flex-start;
  }

  .prod-total {
    text-align: left;
  }
}

/* SweetAlert z-index fix for cart */
:deep(.swal2-container-cart) {
  z-index: 11000 !important;
}

:deep(.swal2-popup-cart) {
  z-index: 11001 !important;
}

:deep(.swal2-title-cart) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #532721;
}

:deep(.swal2-html-container-cart) {
  font-size: 1.1rem;
  color: #3e2723;
  line-height: 1.6;
}

:deep(.swal2-html-container-cart strong) {
  color: #dc3545;
  font-weight: 700;
}
</style>

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
        <span>Precio</span>
        <span>Cantidad</span>
        <span>Total</span>
      </div>

      <div class="carrito-body">
        <!-- Mensaje si está vacío -->
        <div v-if="items.length === 0" style="text-align: center; padding: 2rem; color: #666;">
          Tu carrito está vacío. ¡Busca tu café favorito!
        </div>

        <!-- Lista dinámica de items -->
        <div v-for="item in items" :key="item.nombre" class="carrito-item">
          <div class="prod-info">
            <div class="prod-img-placeholder">
              <img :src="item.imagen" :alt="item.nombre">
            </div>
            <div class="prod-detalles">
              <p>{{ item.nombre }}</p>
              <button class="btn-eliminar" @click="eliminarItem(item.nombre)">🗑️ eliminar</button>
            </div>
          </div>

          <div class="prod-precio">
            ${{ Number(item.precio).toLocaleString('es-CO') }}
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
          <textarea v-model="notas" rows="2"></textarea>
        </div>
        <hr>
        <div class="subtotal-section">
          <span>Subtotal:</span>
          <strong id="subtotal-valor">${{ subtotal.toLocaleString('es-CO') }}</strong>
        </div>
        <button class="btn-pagar" @click="irAPagar">Ir a pagar</button>
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
  Swal.fire({
    title: "¿Eliminar producto?",
    text: `¿Deseas quitar ${nombre} del carrito?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    confirmButtonColor: "#3e2723",
  }).then((result) => {
    if (result.isConfirmed) {
      const filtrados = props.items.filter(i => i.nombre !== nombre);
      emit('update-cart', filtrados);
    }
  });
};

const irAPagar = () => {
  if (props.items.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "No hay productos en tu carretilla para procesar el pago.",
      icon: "info",
      confirmButtonColor: "#3e2723",
    });
    return;
  }

  Swal.fire({
    title: "¡Pedido recibido!",
    text: "Te redirigiremos al pago",
    icon: "success",
    confirmButtonColor: "#3e2723",
  });
};
</script>


<style scoped>

.carrito-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1040;
  transition: opacity 0.3s ease;
}

.carrito-overlay.activo {
  display: block;
}


/* ASIDE — panel lateral derecho */
.carrito-sidebar {
  position: fixed;
  top: 0;
  right: -480px;
  width: 440px;
  max-width: 95vw;
  height: 100vh;
  background: var(--color-background);
  box-shadow: -4px 0 24px rgba(83, 39, 33, 0.18);
  display: flex;
  flex-direction: column;
  z-index: 1050;
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-family-body, "Source Sans 3", sans-serif);
}

.carrito-sidebar.abierto {
right: 0 !important;
  display: flex !important;
  z-index: 9999 !important;
}
.carrito-overlay.activo {
  display: block !important;
  z-index: 9998 !important;
}


/* HEADER del carrito */
.carrito-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.25rem;
  background: var(--color-primary);
  color: #fff;
}

.carrito-header h2 {
  font-family: var(--font-family-display, "Playfair Display", serif);
  font-size: 1.25rem;
  margin: 0;
  letter-spacing: 0.04em;
}

.btn-cerrar {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  transition: color 0.2s;
}

.btn-cerrar:hover {
  color: var(--color-secondary);
}


/*  TABLA HEADER — columnas */
.carrito-tabla-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  background: var(--color-secondary);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}


/*    BODY — lista de items (scroll) */
.carrito-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.carrito-body::-webkit-scrollbar {
  width: 5px;
}
.carrito-body::-webkit-scrollbar-thumb {
  background: var(--color-secondary-muted);
  border-radius: 4px;
}


/*    ITEM individual */
.carrito-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-secondary-muted);
  transition: background 0.15s;
}

.carrito-item:hover {
  background: rgba(176, 141, 87, 0.08);
}


/* — Columna 1: imagen + nombre + botón eliminar — */
.prod-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0; /* permite que el texto haga ellipsis */
}

.prod-img-placeholder {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-secondary-muted);
}

.prod-img-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-detalles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.prod-detalles p {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-default);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-eliminar {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.00rem;
  padding: 0;
  color: var(--color-primary);
  transition: transform 0.15s;
  align-self: flex-start;
}

.btn-eliminar:hover {
  transform: scale(1.2);
}


/* — Columna 2: precio unitario — */
.prod-precio {
  font-size: 0.82rem;
  color: var(--color-text-default);
  text-align: center;
}


/* — Columna 3: controles cantidad — */
.prod-cantidad {
  display: flex;
  justify-content: center;
}

.control-cantidad {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  padding: 0.1rem 0.3rem;
  background: #fff;
}

.control-cantidad button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  padding: 0 0.2rem;
  line-height: 1;
  transition: color 0.15s;
}

.control-cantidad button:hover {
  color: var(--color-secondary);
}

.item-cantidad {
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 1.4rem;
  text-align: center;
  color: var(--color-text-default);
}


/* — Columna 4: subtotal — */
.prod-total,
.item-subtotal {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  text-align: right;
}


/*    FOOTER del carrito */
.carrito-footer {
  padding: 1rem 1.25rem;
  border-top: 2px solid var(--color-secondary);
  background: var(--color-background);
}

.conteo-productos {
  font-size: 0.82rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 0.6rem;
}

.notas-pedido {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.notas-pedido label {
  font-size: 0.78rem;
  color: var(--color-text-default);
  font-weight: 600;
}

.notas-pedido textarea {
  resize: vertical;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.82rem;
  font-family: var(--font-family-body, sans-serif);
  background: #fff;
  color: var(--color-text-default);
}

.notas-pedido textarea:focus {
  outline: none;
  border-color: var(--color-border-active);
}

.subtotal-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0 1rem;
  font-size: 1rem;
}

.subtotal-section span {
  color: var(--color-text-default);
  font-weight: 600;
}

.subtotal-section strong {
  color: var(--color-primary);
  font-size: 1.15rem;
}

.btn-pagar {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-family-display, serif);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-pagar:hover {
  background: var(--color-primary-active);
}


/*    RESPONSIVE — móvil  */
@media (max-width: 480px) {
  .carrito-sidebar {
    width: 100vw;
  }

  .carrito-tabla-header,
  .carrito-item {
    grid-template-columns: 2fr 1fr 1fr;  /* oculta columna precio en móvil */
  }

  /* Oculta la columna "Precio" en móvil */
  .carrito-tabla-header span:nth-child(2),
  .prod-precio {
    display: none;
  }
}
/* MEJORAS VISUALES EXTRA */


/* animación al abrir carrito */
.carrito-sidebar{
  transition: right .35s ease, box-shadow .3s ease;
}

/* sombra premium */
.carrito-sidebar.abierto{
  box-shadow: -8px 0 30px rgba(0,0,0,.18);
}

/* hover productos */
.carrito-item{
  border-radius: 8px;
}

.carrito-item:hover{
  transform: translateX(-3px);
}

/* botones cantidad */
.control-cantidad button{
  transition: .2s ease;
}

.control-cantidad button:hover{
  transform: scale(1.12);
}

/* botón pagar */
.btn-pagar{
  transition: .3s ease;
}

.btn-pagar:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,.15);
}

/* textarea */
.notas-pedido textarea{
  transition: .2s ease;
}

.notas-pedido textarea:focus{
  box-shadow: 0 0 0 3px rgba(176,141,87,.2);
}

/* scroll bonito */
.carrito-body::-webkit-scrollbar{
  width:6px;
}

.carrito-body::-webkit-scrollbar-thumb{
  background:#b08d57;
  border-radius:10px;
}

 /*FLEX GLOBAL RESPONSIVE*/

.carrito-header,
.subtotal-section,
.prod-info,
.control-cantidad,
.notas-pedido,
.carrito-footer{
  display:flex;
}

.carrito-footer{
  flex-direction:column;
}

/* celular */
@media(max-width:768px){

  .carrito-item{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
  }

  .prod-cantidad,
  .prod-total,
  .prod-precio{
    width:100%;
    text-align:left;
  }

  .control-cantidad{
    justify-content:flex-start;
  }
}
</style>

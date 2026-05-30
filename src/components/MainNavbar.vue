<template>
  <div class="nav-container-full">
    <!-- Franja -->
    <div class="label-tag-full">
      ¡ Conoce historias de Café, desde la cosecha hasta la taza caliente en la mañana!
    </div>

    <nav class="navbar navbar-expand-lg nav-custom-full">
      <!-- Logo -->
      <a class="navbar-brand brand-container" href="/">
        <img src="/assets/img/logo-light.svg" class="nav-logo">
      </a>

      <!-- Botón hamburguesa -->
      <button 
        class="navbar-toggler hamburger-btn" 
        type="button" 
        @click="isMenuOpen = !isMenuOpen"
        :aria-expanded="isMenuOpen"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- Contenido -->
      <div 
        class="collapse navbar-collapse" 
        :class="{ 'show': isMenuOpen }" 
        id="navbarMenu"
      >
        <!-- Links (Ahora se centrarán perfectamente) -->
        <div class="navbar-nav">
          <a class="nav-link link3" @click.prevent="navigate('/')">Inicio</a>
          <a class="nav-link link3" @click.prevent="navigate('/catalogo')">Catálogo</a>
          <a class="nav-link link3" @click.prevent="navigate('/nosotros')">Nosotros</a>
          <a class="nav-link link3" @click.prevent="navigate('/contacto')">Contacto</a>
        </div>

        <!-- Acciones -->
        <div class="nav-actions">
          <!-- Carrito -->
          <button class="icon-btn3" @click="$emit('open-cart')">
            <img src="/assets/icons/carritoCafe2.svg" alt="carrito de compras" class="carrito-icon">
            <div v-if="cartCount > 0" class="badge-dot3">{{ cartCount }}</div>
          </button>

          <div class="user-auth-wrapper">
            <div class="user-avatar-section">
              <div class="avatar-circle">
                <img src="/assets/icons/user.svg" alt="usuario" class="usuario-icon-nav">
              </div>
              <div v-if="isAuthenticated" class="user-info">
                <span class="user-greeting">Hola,</span>
                <span class="user-name">{{ userName }}</span>
              </div>
            </div>
            
            <button 
              v-if="!isAuthenticated" 
              @click="navigate('/auth')" 
              class="auth-btn login-btn"
            >
              <i class="bi bi-person"></i>
              Iniciar Sesión
            </button>
            <button 
              v-else 
              @click="logout" 
              class="auth-btn logout-btn"
            >
              <i class="bi bi-box-arrow-right"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['open-cart', 'change-page']);
const router = useRouter();

const isMenuOpen = ref(false);
const isAuthenticated = ref(false);
const userName = ref('');

onMounted(() => {
  const user = localStorage.getItem('usuarioActivo');
  if (user) {
    isAuthenticated.value = true;
    const userData = JSON.parse(user);
    userName.value = userData.name || userData.fullName || 'Usuario';
  }
  
  // Limpiar carrito al cargar si hay cambio de usuario
  const lastUserId = localStorage.getItem('lastUserId');
  const currentUserId = user ? JSON.parse(user).id : null;
  
  if (lastUserId && currentUserId && lastUserId !== String(currentUserId)) {
    localStorage.removeItem('carritoCafe');
    console.log('Carrito limpiado por cambio de usuario');
  }
  
  if (currentUserId) {
    localStorage.setItem('lastUserId', String(currentUserId));
  }
});

const navigate = (url) => {
  if (window.location.pathname === url) return;
  
  isMenuOpen.value = false;
  router.push(url);
};

const logout = () => {
  localStorage.removeItem('usuarioActivo');
  localStorage.removeItem('authToken');
  isAuthenticated.value = false;
  userName.value = '';
  navigate('/');
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
  --color-highlight: rgba(176, 141, 87, 0.1);
}

.nav-container-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid var(--color-border-default);
  box-shadow: 0 4px 20px rgba(83, 39, 33, 0.08);
}

.label-tag-full {
  font-size: 11px;
  text-align: center;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  color: #fff;
  padding: 6px 0;
  letter-spacing: 1.5px;
  font-weight: 600;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
}

.nav-custom-full {
  position: relative; /* Necesario para el centrado absoluto del menú */
  width: 100%;
  margin: 0;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.brand-container {
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
}

.nav-logo {
  max-height: 100px;
  width: auto;
  object-fit: contain;
  padding: 10px 0;
}

/* --- ESTILOS DE LOS ENLACES --- */
.link3 {
  font-size: 15px;
  color: var(--color-text-default);
  text-decoration: none;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
  cursor: pointer;
  border-radius: 8px;
}

.link3:hover,
.link3.active3 {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background: rgba(176, 141, 87, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(176, 141, 87, 0.15);
}

/* --- ACCIONES DERECHA (Carrito + Login) --- */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.icon-btn3 {
  border: none !important;
  background: rgba(176, 141, 87, 0.1) !important;
  box-shadow: 0 2px 8px rgba(176, 141, 87, 0.15) !important;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 0;
}

.icon-btn3:hover {
  background-color: var(--color-secondary) !important;
  color: white !important;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3) !important;
}

.carrito-icon {
  width: 26px;
  height: 26px;
}

.badge-dot3 {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  color: white;
  padding: 5px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  position: absolute;
  top: -5px;
  right: -5px;
  box-shadow: 0 3px 10px rgba(83, 39, 33, 0.4);
  border: 2px solid white;
  min-width: 20px;
  text-align: center;
  letter-spacing: 0.5px;
}

.user-auth-wrapper {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-left: 24px;
  border-left: 2px solid var(--color-border-default);
  background: linear-gradient(135deg, rgba(176, 141, 87, 0.08) 0%, rgba(176, 141, 87, 0.03) 100%);
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 280px;
}

.user-auth-wrapper:hover {
  background: linear-gradient(135deg, rgba(176, 141, 87, 0.12) 0%, rgba(176, 141, 87, 0.05) 100%);
  box-shadow: 0 4px 12px rgba(176, 141, 87, 0.15);
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(176, 141, 87, 0.3);
}

.usuario-icon-nav {
  width: 22px;
  height: 22px;
  filter: brightness(0) invert(1);
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-greeting {
  font-size: 0.75rem;
  color: rgba(26, 26, 26, 0.6);
  font-weight: 500;
}

.user-name {
  font-size: 0.95rem;
  color: var(--color-primary);
  font-weight: 700;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  white-space: nowrap;
}

.login-btn {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(83, 39, 33, 0.25);
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-active) 0%, #2a0f0d 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(83, 39, 33, 0.35);
}

.logout-btn {
  background: transparent;
  border: 2px solid var(--color-primary) !important;
  color: var(--color-primary) !important;
}

.logout-btn:hover {
  background: var(--color-primary) !important;
  color: white !important;
  transform: translateY(-2px);
}

.hamburger-btn {
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background-color: var(--color-primary);
  display: block;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.navbar-toggler[aria-expanded="true"] .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar-toggler[aria-expanded="true"] .hamburger-line:nth-child(2) {
  opacity: 0;
}

.navbar-toggler[aria-expanded="true"] .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* --- MAGIA DEL CENTRADO EN ESCRITORIO --- */
@media (min-width: 992px) {
  .collapse.navbar-collapse {
    display: flex !important;
    justify-content: flex-end; /* Empuja las acciones del usuario a la derecha */
    align-items: center;
  }

  .navbar-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%); /* Centrado matemático respecto a la pantalla */
    display: flex;
    flex-direction: row;
    gap: 2rem; /* Separación amplia entre opciones */
  }
}

/* --- RESPONSIVE (MÓVIL Y TABLET) --- */
@media (max-width: 991.98px) {
  .nav-custom-full {
    padding: 10px 20px;
    min-height: auto;
  }

  .collapse.navbar-collapse {
    width: 100%;
    padding-top: 10px;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, opacity 0.35s ease, padding-top 0.35s ease;
  }

  .collapse.navbar-collapse.show {
    opacity: 1;
    max-height: 700px;
    padding-top: 10px;
  }

  .navbar-nav {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    margin-top: 10px;
  }

  .navbar-nav .nav-link {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .nav-actions {
    width: 100%;
    justify-content: center;
    margin-top: 15px;
    flex-direction: column;
    gap: 15px;
  }

  .user-auth-wrapper {
    width: 100%;
    justify-content: center;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(176, 141, 87, 0.2);
    padding-top: 15px;
    flex-direction: column;
  }

  .user-avatar-section {
    width: 100%;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }

  .user-info {
    text-align: center;
  }
}
</style>
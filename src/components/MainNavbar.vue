<template>
  <div class="nav-container-full">
    <!-- Franja superior -->
    <div class="label-tag-full">
      ¡Conoce historias de Café, desde la cosecha hasta la taza caliente en la mañana!
    </div>

    <!-- Animación -->
    <div v-if="isAnimating" id="coffecup-transition" class="launching">
      <div class="coffee-stain"></div>
      <div class="coffecup">
        <img src="/assets/img/animation_cup.svg" class="coffecup-img">
      </div>
    </div>

    <nav class="navbar navbar-expand-lg nav-custom-full">
      <a class="navbar-brand brand-container" href="/">
        <img src="/assets/img/logo.png" class="nav-logo">
      </a>

      <!-- Botón hamburguesa -->
      <button 
        class="navbar-toggler hamburger-btn" 
        type="button" 
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- Menú -->
      <div 
        class="collapse navbar-collapse" 
        :class="{ 'show': isMenuOpen }" 
        id="navbarMenu"
      >
        <div class="navbar-nav mx-auto">
          <a class="nav-link link3 opcionesBarra" @click.prevent="navigate('/catalogo')">Catálogo</a>
          <a class="nav-link link3" @click.prevent="navigate('/origen')">Origen</a>
          <a class="nav-link link3 opcionesBarra" @click.prevent="navigate('/nosotros')">Nosotros</a>
          <a class="nav-link link3 opcionesBarra" @click.prevent="navigate('/contacto')">Contacto</a>
        </div>

        <div class="nav-actions">
          <!-- Carrito con Badge -->
          <button class="icon-btn3" @click="$emit('open-cart')">
            <img src="/assets/icons/carritoCafe2.svg" alt="carrito" class="carrito-icon">
            <div v-if="cartCount > 0" class="badge-dot3">{{ cartCount }}</div>
          </button>

          <!-- Acciones de Usuario-->
          <!-- En MainNavbar.vue -->
        <div class="auth-wrapper">
          <router-link to="/auth" class="login-link">Ingresar</router-link>
          <router-link to="/auth" class="cta-primary">Registro</router-link>
        </div>

        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['open-cart', 'change-page']);

const isAnimating = ref(false);
const isMenuOpen = ref(false);

onMounted(() => {
  const played = sessionStorage.getItem("coffeeAnimation");
  if (played === "played") {
    sessionStorage.removeItem("coffeeAnimation");
  }
});

const navigate = (url) => {
  if (window.location.pathname === url) return;
  
  isMenuOpen.value = false;
  isAnimating.value = true;
  document.body.style.overflow = "hidden";
  sessionStorage.setItem("coffeeAnimation", "played");

  setTimeout(() => {
    window.location.href = url;
  }, 900);
};
</script>

<style scoped>
.nav-container-full {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #eee;
}

.label-tag-full {
  font-size: 11px;
  text-align: center;
  background: var(--color-primary, #4b3621);
  color: #fff;
  padding: 6px 0;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-weight: 500;
}

.nav-custom-full {
  max-width: 1400px;
  margin: auto;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
}

.nav-logo { max-height: 60px; width: auto; transition: transform 0.3s; }
.nav-logo:hover { transform: scale(1.05); }

.link3 {
  cursor: pointer;
  font-size: 15px;
  color: #333;
  padding: 0 20px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.link3:hover { color: var(--color-primary, #4b3621); }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 24px; /* Más espacio entre carrito y login */
}

.auth-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 1px solid #eee; /* Línea divisoria sutil */
  padding-left: 20px;
}

.login-link {
  font-size: 14px;
  color: #555;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
}
.login-link:hover { color: #000; }

.cta-primary {
  background: var(--color-primary, #4b3621);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 50px; /* Estilo pill, más moderno */
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(75, 54, 33, 0.15);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(75, 54, 33, 0.25);
  background: #3a2a1a;
}

.icon-btn3 {
  border: none;
  background: transparent;
  position: relative;
  cursor: pointer;
  padding: 5px;
}

.carrito-icon { width: 26px; height: 26px; }

.badge-dot3 {
  background-color: #d97706;
  color: white;
  padding: 2px 5px;
  border-radius: 50%;
  font-size: 10px;
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  font-weight: bold;
}

@media (max-width: 991px) {
  .navbar-collapse {
    background: white;
    padding: 30px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }
  .nav-actions {
    flex-direction: column;
    margin-top: 25px;
    gap: 20px;
  }
  .auth-wrapper {
    border-left: none;
    padding-left: 0;
    flex-direction: column;
    width: 100%;
  }
  .cta-primary { width: 100%; text-align: center; }
}

/* Animaciones de la taza permanecen igual */
#coffecup-transition {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.coffee-stain {
  position: absolute;
  width: 0; height: 0;
  background: rgba(60, 42, 33, 0.6);
  border-radius: 50%;
  filter: blur(15px);
  animation: fillScreen 1.2s ease-in-out forwards;
}

.coffecup {
  width: 180px;
  animation: cupBehavior 1.2s ease-in-out forwards;
}

@keyframes fillScreen {
  0% { width: 0; height: 0; opacity: 0; }
  70% { width: 150vmax; height: 150vmax; opacity: 1; }
  100% { width: 150vmax; height: 150vmax; opacity: 0; }
}

@keyframes cupBehavior {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  20% { transform: scale(1.1) rotate(-10deg); opacity: 1; }
  100% { opacity: 0; transform: scale(1.4); }
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: #4b3621;
  margin: 5px auto;
}
</style>

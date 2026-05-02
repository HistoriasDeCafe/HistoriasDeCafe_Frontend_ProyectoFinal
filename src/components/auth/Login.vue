<template>
  <div class="auth-component">
    <div class="header-imagen">
      <!-- GIF específico para Login -->
      <img src="/assets/img/gifRegistrar.gif" alt="Login">
    </div>

    <div class="contenedor-formulario">
      <div class="tabs">
        <a class="tab active">Iniciar Sesión</a>
        <a class="tab" @click="$emit('switch')">Registrarse</a>
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Campo Email -->
        <div class="campo-wrapper">
          <div class="grupo-input" :class="{ 'is-invalid-border': errors.email }">
            <i class="fa-regular fa-envelope"></i>
            <input 
              v-model="loginData.email" 
              type="email" 
              placeholder="Correo electrónico:" 
            >
          </div>
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <!-- Campo Password -->
        <div class="campo-wrapper">
          <div class="grupo-input" :class="{ 'is-invalid-border': errors.password }">
            <i class="fa-solid fa-lock"></i>
            <input 
              v-model="loginData.password" 
              :type="showPass ? 'text' : 'password'" 
              placeholder="Contraseña:" 
            >
            <i 
              :class="showPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" 
              @click="showPass = !showPass"
              class="toggle-pass"
            ></i>
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="forgot-pass">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" class="btn-login">Ingresar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['switch']);
const showPass = ref(false);

const loginData = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const handleLogin = () => {
  // Limpiar errores previos
  errors.email = '';
  errors.password = '';

  // Validaciones básicas de estilo
  if (!loginData.email.includes('@')) {
    errors.email = "Ingresa un correo válido";
    return;
  }
  if (loginData.password.length < 1) {
    errors.password = "La contraseña es obligatoria";
    return;
  }

  // Lógica de autenticación con LocalStorage
  const users = JSON.parse(localStorage.getItem('usuariosCafe') || '[]');
  const userFound = users.find(u => u.email === loginData.email && u.password === loginData.password);

  if (userFound) {
    localStorage.setItem('userSession', JSON.stringify({
      name: userFound.fullName,
      email: userFound.email,
      isLoggedIn: true
    }));

    Swal.fire({
      title: `¡Bienvenido, ${userFound.fullName}!`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => {
      window.location.href = "/"; 
    }, 1600);
  } else {
    Swal.fire('Error', 'Credenciales incorrectas', 'error');
  }
};
</script>

<style scoped>
/* Reutilizamos exactamente tu bloque de estilos de Register */
.is-invalid-border { border: 1px solid #ff5252 !important; }
.error-text { color: #ff5252; font-size: 11px; margin-top: 5px; display: block; text-align: left; }

.auth-component {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.header-imagen {
    width: 100%;
    height: 180px;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-bottom-left-radius: 80px;
}

.header-imagen img {
    width: 100%;       
    height: 100%;     
    object-fit: cover; 
    object-position: center; 
}

.contenedor-formulario {
    padding: 30px;
    flex-grow: 1;
}

.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 25px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 10px;
}

.tab {
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
}

.tab.active {
    color: #fff;
    text-shadow: 0 0 10px rgba(255,255,255,0.5);
}

.campo-wrapper {
    margin-bottom: 18px;
}

.grupo-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.grupo-input input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
    outline: none;
}

.btn-login {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #f3e5f5;
    color: #3E2723;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
}

.forgot-pass {
    text-align: right;
    margin-bottom: 15px;
}

.forgot-pass a {
    color: #D7CCC8;
    font-size: 0.8rem;
    text-decoration: none;
}
</style>

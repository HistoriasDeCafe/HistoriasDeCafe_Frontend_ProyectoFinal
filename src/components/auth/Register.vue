<template>
  <div class="auth-component">
    <div class="header-imagen">
    <img src="/assets/img/gifRegistrar.gif">
    </div>

    <div class="contenedor-formulario">
      <div class="tabs">
        <a class="tab" @click="$emit('switch')">Iniciar Sesión</a>
        <a class="tab active">Registrarse</a>
      </div>

      <form @submit.prevent="handleRegister">
        <!-- Nombre -->
        <div class="campo-wrapper">
          <div class="grupo-input" :class="{ 'is-invalid-border': errors.name }">
            <i class="fa-solid fa-user"></i>
            <input v-model="user.fullName" type="text" placeholder="Nombre Completo:">
          </div>
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <!-- Email -->
        <div class="campo-wrapper">
          <div class="grupo-input" :class="{ 'is-invalid-border': errors.email }">
            <i class="fa-regular fa-envelope"></i>
            <input v-model="user.email" type="email" placeholder="Correo electrónico:">
          </div>
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <!-- Password 1 -->
        <div class="campo-wrapper">
          <div class="grupo-input" :class="{ 'is-invalid-border': errors.password }">
            <i class="fa-solid fa-lock"></i>
            <input :type="showPass1 ? 'text' : 'password'" v-model="user.password" placeholder="Contraseña:">
            <i :class="showPass1 ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" 
               @click="showPass1 = !showPass1" class="toggle-pass"></i>
          </div>
        </div>

        <!-- Password 2 -->
        <div class="campo-wrapper">
          <div class="grupo-input" :class="{ 'is-invalid-border': errors.confirm }">
            <i class="fa-solid fa-lock"></i>
            <input :type="showPass2 ? 'text' : 'password'" v-model="user.confirmPassword" placeholder="Confirmar Contraseña:">
            <i :class="showPass2 ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" 
               @click="showPass2 = !showPass2" class="toggle-pass"></i>
          </div>
        </div>

        <!-- INDICADORES EN TIEMPO REAL (Tu pswd_info de Vanilla) -->
        <div class="pswd_info">
          <ul>
            <li :class="status.length ? 'valid' : 'invalid'">Mínimo 8 caracteres</li>
            <li :class="status.letter ? 'valid' : 'invalid'">Al menos una letra</li>
            <li :class="status.capital ? 'valid' : 'invalid'">Al menos una mayúscula</li>
            <li :class="status.number ? 'valid' : 'invalid'">Al menos un número</li>
            <li :class="status.blank ? 'valid' : 'invalid'">Sin espacios</li>
            <li :class="status.match ? 'valid' : 'invalid'">Las contraseñas coinciden</li>
          </ul>
        </div>

        <button type="submit" class="btn-registrarse">Registrarse</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['switch']);
const showPass1 = ref(false);
const showPass2 = ref(false);

const user = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirm: ''
});

// --- Lógica de tus Validators migrada a Computed ---
const status = computed(() => {
  const p = user.password;
  const c = user.confirmPassword;
  return {
    length: p.length >= 8,
    letter: /[A-Za-z]/.test(p),
    capital: /[A-Z]/.test(p),
    number: /\d/.test(p),
    blank: p.length > 0 && !/ /.test(p),
    match: p === c && p.length > 0
  };
});

const handleRegister = () => {
  // Limpiar errores previos
  Object.keys(errors).forEach(key => errors[key] = '');

  // Validar Email (Tu lógica de validateEmail)
  if (!user.email.includes('@')) {
    errors.email = "Formato de correo inválido";
    return;
  }

  // Validar Password (Usando el objeto status)
  if (!Object.values(status.value).every(val => val)) {
    Swal.fire('Atención', 'Revisa los requisitos de la contraseña', 'warning');
    return;
  }

  // Guardar en LocalStorage
  const users = JSON.parse(localStorage.getItem('usuariosCafe') || '[]');
  users.push({ 
    fullName: user.fullName, 
    email: user.email, 
    password: user.password 
  });
  localStorage.setItem('usuariosCafe', JSON.stringify(users));

  Swal.fire('¡Éxito!', 'Te has registrado correctamente', 'success');
  emit('switch');
};
</script>

<style scoped>
.pswd_info {
  margin: 15px 0;
  background: rgba(0,0,0,0.1);
  padding: 10px;
  border-radius: 8px;
}
.pswd_info ul { list-style: none; padding: 0; margin: 0; }
.pswd_info li { font-size: 0.75rem; margin-bottom: 2px; transition: 0.3s; }

.valid { color: #a5d6a7; } /* Verde suave */
.invalid { color: #ef9a9a; opacity: 0.7; } /* Rojo suave */

.is-invalid-border { border: 1px solid #ff5252 !important; }
.error-text { color: #ff5252; font-size: 11px; margin-top: -10px; margin-bottom: 10px; display: block; }
/* Aplica esto a Login y Register para que se expandan */
.auth-component {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.header-imagen {
    width: 100%;
    height: 180px; /* Ajusta esta altura según prefieras */
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Corta cualquier parte de la imagen que sobresalga */
    border-bottom-left-radius: 80px; /* El estilo curvo que tenías */
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
    transition: all 0.3s;
}

.grupo-input:focus-within {
    background: rgba(255, 255, 255, 0.2);
    border-color: #fff;
    box-shadow: 0 0 15px rgba(255,255,255,0.1);
}

.grupo-input i {
    color: #D7CCC8;
    width: 20px;
    text-align: center;
}

.grupo-input input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
    outline: none;
    font-size: 0.95rem;
}

.grupo-input input::placeholder {
    color: rgba(215, 204, 200, 0.7);
}

.toggle-pass {
    cursor: pointer;
    font-size: 0.9rem;
}

/* Botones Profesionales */
.btn-login, .btn-registrarse {
    width: 100%;
    padding: 14px;
    margin-top: 10px;
    border-radius: 12px;
    border: none;
    background: #f3e5f5; /* Color crema/lavanda de tu paleta */
    color: #3E2723;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
}

.btn-login:hover, .btn-registrarse:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.forgot-pass {
    text-align: right;
    margin-top: -10px;
    margin-bottom: 20px;
}

.forgot-pass a {
    color: #D7CCC8;
    font-size: 0.8rem;
    text-decoration: none;
}

</style>

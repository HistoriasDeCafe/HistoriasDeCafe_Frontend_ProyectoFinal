<template>
  <div class="auth-component">
    <div class="card">
      <!-- Imagen -->
      <div class="header-imagen">
        <img src="/assets/img/coffeecup.gif" alt="gifLogin">
      </div>

      <!-- Formulario -->
      <div class="contenedor-formulario">
        <div class="tabs">
          <a class="tab active">Iniciar Sesión</a>
          <a class="tab" @click="$emit('switch')">Registrarse</a>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="campo-wrapper">
            <div class="grupo-input" :class="{ 'is-invalid': errors.email }">
              <i class="fa-regular fa-envelope"></i>
              <input 
                v-model="loginData.email" 
                type="email" 
                placeholder="Correo electrónico:"
                :class="{ 'is-invalid': errors.email }"
              >
            </div>
            <span v-if="errors.email" class="invalid-feedback">{{ errors.email }}</span>
          </div>

          <div class="campo-wrapper">
            <div class="grupo-input" :class="{ 'is-invalid': errors.password }">
              <i class="fa-solid fa-lock"></i>
              <input 
                v-model="loginData.password" 
                :type="showPass ? 'text' : 'password'" 
                placeholder="Contraseña:"
                :class="{ 'is-invalid': errors.password }"
              >
              <i 
                :class="showPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" 
                @click="showPass = !showPass"
                class="toggle-pass"
              ></i>
            </div>
            <span v-if="errors.password" class="invalid-feedback">{{ errors.password }}</span>
          </div>

          <div class="olvido-pass">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" class="btn-registrarse">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const emit = defineEmits(['switch']);
const router = useRouter();
const showPass = ref(false);
const isLoading = ref(false);

const loginData = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const validarEmail = () => {
  const valor = loginData.email.trim();
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (valor === '') {
    errors.email = 'El correo es obligatorio';
    return false;
  }
  if (!formatoEmail.test(valor)) {
    errors.email = 'Formato inválido, ej: correo@dominio.com';
    return false;
  }

  errors.email = '';
  return true;
};

const validarPassword = () => {
  const valor = loginData.password;

  if (valor === '') {
    errors.password = 'La contraseña es obligatoria';
    return false;
  }

  errors.password = '';
  return true;
};

const handleLogin = async () => {
  // Limpiar errores previos
  errors.email = '';
  errors.password = '';

  const emailOk = validarEmail();
  const passOk = validarPassword();

  if (!emailOk || !passOk) return;

  // API: POST /auth/login
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  const loginPayload = {
    email: loginData.email.trim(),
    password: loginData.password
  };

  isLoading.value = true;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });

    if (response.status === 401 || response.status === 403) {
      Swal.fire({
        icon: 'error',
        iconColor: '#8B5E3C',
        title: '¡Correo o contraseña incorrectos!',
        confirmButtonColor: '#8B5E3C'
      });
      return;
    }

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    // AuthResponseDTO: { token, user: { id, name, email, role } }
    const data = await response.json();
    const usuario = data.user;
    const token = data.token;

    // Guardamos sesión en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    localStorage.setItem('authToken', token);

    // Redirigir según rol
    if (usuario.role && usuario.role.toUpperCase() === 'ADMIN') {
      Swal.fire({
        icon: 'success',
        iconColor: '#8B5E3C',
        title: '¡OK! Ingresando al módulo de administración!',
        confirmButtonColor: '#8B5E3C',
        timer: 3400,
        showConfirmButton: false
      }).then(() => {
        router.push('/admin');
      });
    } else {
      Swal.fire({
        icon: 'success',
        iconColor: '#8B5E3C',
        title: `¡Bienvenid@ ${usuario.name}!`,
        confirmButtonColor: '#8B5E3C',
        timer: 3400,
        showConfirmButton: false
      }).then(() => {
        router.push('/catalogo');
      });
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al conectar con el servidor',
      text: 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      confirmButtonColor: '#8B5E3C'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-component {
    width: 100%;
}

.card {
    width: 100%;
    background: var(--color-primary);
    border: none;
    overflow: hidden;
}

.header-imagen {
    width: 100%;
    height: 180px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
}

.header-imagen img {
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.contenedor-formulario {
    padding: 30px 35px;
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 25px;
    margin-bottom: 25px;
}

.tab {
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    padding-bottom: 5px;
    border-bottom: 2px solid transparent;
}

.tab:hover {
    color: rgba(255, 255, 255, 0.9);
}

.tab.active {
    color: #ffffff;
    border-bottom: 2px solid var(--cafe-acento, #A0785C);
}

.campo-wrapper {
    margin-bottom: 25px;
    position: relative;
}

.grupo-input {
    display: flex;
    align-items: center;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 8px;
    transition: all 0.3s ease;
}

.grupo-input:focus-within {
    border-bottom-color: var(--cafe-acento, #A0785C);
}

.grupo-input i {
    margin-right: 15px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
}

.grupo-input input {
    background: none;
    border: none;
    outline: none;
    color: #fff;
    width: 100%;
    font-size: 1rem;
    padding: 2px 0;
}

.grupo-input input::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.grupo-input:has(.is-invalid) {
    border-bottom-color: #ff6b6b !important;
}

.toggle-pass {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    transition: color 0.2s;
}

.toggle-pass:hover {
    color: #fff;
}

.olvido-pass {
    text-align: right;
    margin-top: -10px;
    margin-bottom: 25px;
}

.olvido-pass a {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    text-decoration: none;
    transition: color 0.3s;
}

.olvido-pass a:hover {
    color: #fff;
    text-decoration: underline;
}

.invalid-feedback {
    display: block;
    color: #ff6b6b;
    font-size: 0.8rem;
    font-weight: 500;
    padding-left: 35px;
    margin-top: 6px;
    position: absolute;
    animation: fadeInError 0.3s ease-out forwards;
}

@keyframes fadeInError {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.btn-registrarse {
    display: block;
    width: 100%;
    padding: 14px;
    border-radius: 50px;
    border: 2px solid transparent;
    background-color: var(--cafe-acento, #A0785C);
    color: white;
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    margin-top: 30px;
}

.btn-registrarse:hover {
    background-color: #A0785C;
    border-color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

/* Mobile Responsive */
@media (max-width: 480px) {
    .header-imagen {
        height: 140px;
    }

    .contenedor-formulario {
        padding: 20px 25px;
    }

    .tabs {
        gap: 20px;
        margin-bottom: 20px;
    }

    .tab {
        font-size: 1rem;
    }

    .campo-wrapper {
        margin-bottom: 20px;
    }

    .grupo-input i {
        margin-right: 12px;
        font-size: 1rem;
    }

    .grupo-input input {
        font-size: 0.95rem;
    }

    .invalid-feedback {
        font-size: 0.75rem;
        padding-left: 32px;
    }

    .olvido-pass {
        margin-bottom: 20px;
    }

    .olvido-pass a {
        font-size: 0.8rem;
    }

    .btn-registrarse {
        padding: 12px;
        font-size: 1rem;
        margin-top: 25px;
    }
}

@media (max-width: 360px) {
    .header-imagen {
        height: 120px;
    }

    .contenedor-formulario {
        padding: 15px 20px;
    }

    .tabs {
        gap: 15px;
    }

    .tab {
        font-size: 0.9rem;
    }

    .grupo-input i {
        margin-right: 10px;
        font-size: 0.9rem;
    }

    .grupo-input input {
        font-size: 0.9rem;
    }

    .btn-registrarse {
        padding: 10px;
        font-size: 0.95rem;
    }
}
</style>

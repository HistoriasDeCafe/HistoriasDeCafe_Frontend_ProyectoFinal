<template>
  <div class="auth-component">
    <div class="card">
      <!-- Imagen -->
      <div class="header-imagen">
        <img src="/assets/img/cafePlano.gif" alt="gifRegister">
      </div>

      <!-- Formulario -->
      <div class="contenedor-formulario">
        <div class="tabs">
          <a class="tab" @click="$emit('switch')">Iniciar Sesión</a>
          <a class="tab active">Registrarse</a>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="campo-wrapper">
            <div class="grupo-input" :class="{ 'is-invalid': errors.name }">
              <i class="fa-solid fa-user"></i>
              <input 
                v-model="user.fullName" 
                type="text" 
                placeholder="Nombre Completo:"
                :class="{ 'is-invalid': errors.name }"
              >
            </div>
            <span v-if="errors.name" class="invalid-feedback">{{ errors.name }}</span>
          </div>

          <div class="campo-wrapper">
            <div class="grupo-input" :class="{ 'is-invalid': errors.email }">
              <i class="fa-regular fa-envelope"></i>
              <input  
                v-model="user.email" 
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
                :type="showPass1 ? 'text' : 'password'" 
                v-model="user.password" 
                placeholder="Contraseña:"
                :class="{ 'is-invalid': errors.password }"
                @focus="showPswdInfo = true"
                @blur="showPswdInfo = false"
              >
              <i 
                :class="showPass1 ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" 
                @click="showPass1 = !showPass1" 
                class="toggle-pass"
              ></i>
            </div>
            <span v-if="errors.password" class="invalid-feedback">{{ errors.password }}</span>
          </div>

          <div class="campo-wrapper">
            <div class="grupo-input" :class="{ 'is-invalid': errors.confirm }">
              <i class="fa-solid fa-lock"></i>
              <input 
                :type="showPass2 ? 'text' : 'password'" 
                v-model="user.confirmPassword" 
                placeholder="Confirmar Contraseña:"
                :class="{ 'is-invalid': errors.confirm }"
              >
              <i 
                :class="showPass2 ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" 
                @click="showPass2 = !showPass2" 
                class="toggle-pass"
              ></i>
            </div>
            <span v-if="errors.confirm" class="invalid-feedback">{{ errors.confirm }}</span>
          </div>

          <!-- Indicadores de contraseña -->
          <div id="pswd_info" v-show="showPswdInfo">
            <ul>
              <li :class="status.length ? 'valid' : ''">Mínimo 8 caracteres</li>
              <li :class="status.letter ? 'valid' : ''">Al menos una letra</li>
              <li :class="status.capital ? 'valid' : ''">Al menos una mayúscula</li>
              <li :class="status.number ? 'valid' : ''">Al menos un número</li>
              <li :class="status.blank ? 'valid' : ''">Sin espacios</li>
              <li :class="status.null ? 'valid' : ''">Ambos campos llenos</li>
              <li :class="status.match ? 'valid' : ''">Las contraseñas coinciden</li>
            </ul>
          </div>

          <button type="submit" class="btn-registrarse">Registrarse</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['switch']);
const showPass1 = ref(false);
const showPass2 = ref(false);
const showPswdInfo = ref(false);
const isLoading = ref(false);

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

// --- Lógica de Validators migrada a Computed ---
const status = computed(() => {
  const p = user.password;
  const c = user.confirmPassword;
  return {
    length: p.length >= 8,
    letter: /[A-Za-z]/.test(p),
    capital: /[A-Z]/.test(p),
    number: /\d/.test(p),
    blank: p.length > 0 && !/ /.test(p),
    null: p.length > 0 && c.length > 0,
    match: p === c && p.length > 0
  };
});

const validarNombre = () => {
  const valor = user.fullName.trim();
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (valor === '') {
    errors.name = 'El nombre es obligatorio';
    return false;
  }
  if (valor.length < 3) {
    errors.name = 'Mínimo 3 caracteres';
    return false;
  }
  if (!soloLetras.test(valor)) {
    errors.name = 'Solo letras y espacios, sin números';
    return false;
  }

  errors.name = '';
  return true;
};

const validarEmail = () => {
  const valor = user.email.trim();
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

const validarFortaleza = () => {
  const valor = user.password;

  if (valor === '') {
    errors.password = 'La contraseña es obligatoria';
    return false;
  }
  if (valor.length < 8) {
    errors.password = 'Mínimo 8 caracteres';
    return false;
  }
  if (!/[A-Z]/.test(valor)) {
    errors.password = 'Debe tener al menos una mayúscula';
    return false;
  }
  if (!/\d/.test(valor)) {
    errors.password = 'Debe tener al menos un número';
    return false;
  }
  if (/ /.test(valor)) {
    errors.password = 'No puede contener espacios';
    return false;
  }

  errors.password = '';
  return true;
};

const validarContrasenas = () => {
  const p1 = user.password;
  const p2 = user.confirmPassword;

  if (p2 === '') {
    errors.confirm = 'Confirma tu contraseña';
    return false;
  }
  if (p1 !== p2) {
    errors.confirm = 'Las contraseñas no coinciden';
    return false;
  }

  errors.confirm = '';
  return true;
};

const handleRegister = async () => {
  // Limpiar errores previos
  Object.keys(errors).forEach(key => errors[key] = '');

  const nombreOk = validarNombre();
  const emailOk = validarEmail();
  const passOk = validarFortaleza();
  const matchOk = validarContrasenas();

  if (!nombreOk || !emailOk || !passOk || !matchOk) return;

  // API: POST /auth/register
  const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://e-commerce-historias-de-cafe-backend.onrender.com';

  const registerPayload = {
    name: user.fullName.trim(),
    email: user.email.trim(),
    password: user.password,
    role: 'CLIENT'
  };

  console.log('API URL:', API_URL);
  console.log('Register payload:', registerPayload);

  isLoading.value = true;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });

    if (response.status === 409) {
      // El backend devuelve 409 si el correo ya existe
      errors.email = 'El correo ya está registrado';
      Swal.fire({
        icon: 'info',
        iconColor: '#8B5E3C',
        title: 'Este correo ya está registrado',
        confirmButtonColor: '#8B5E3C',
        timer: 3400,
        showConfirmButton: false
      });
      return;
    }

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    // UserResponseDTO: { id, name, email, role }
    const nuevoUsuario = await response.json();

    Swal.fire({
      icon: 'success',
      iconColor: '#8B5E3C',
      title: `¡Bienvenid@ ${nuevoUsuario.name}!`,
      text: 'Tu cuenta fue creada exitosamente.',
      confirmButtonColor: '#8B5E3C',
      timer: 3400,
      showConfirmButton: false
    });

    console.log('Usuario registrado:', nuevoUsuario);

    // Reset form
    user.fullName = '';
    user.email = '';
    user.password = '';
    user.confirmPassword = '';
    Object.keys(errors).forEach(key => errors[key] = '');

    emit('switch');

  } catch (error) {
    console.error('Error al registrar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al conectar con el servidor',
      text: 'No se pudo completar el registro. Inténtalo de nuevo.',
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

/* Caja de validación de contraseña */
#pswd_info {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 15px 20px;
    margin-top: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideDownInfo 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

#pswd_info ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
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

    #pswd_info {
        padding: 12px 15px;
        margin-top: 12px;
    }

    #pswd_info ul {
        grid-template-columns: 1fr;
        gap: 6px;
    }

    #pswd_info li {
        font-size: 0.75rem;
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

    #pswd_info {
        padding: 10px 12px;
    }

    #pswd_info li {
        font-size: 0.7rem;
    }

    .btn-registrarse {
        padding: 10px;
        font-size: 0.95rem;
    }
}

#pswd_info li {
    font-size: 0.78rem;
    color: #ff6b6b;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.3s ease;
}

#pswd_info li.valid {
    color: #2ecc71;
}

#pswd_info li::before {
    content: "•";
    font-size: 1.2rem;
}

@keyframes slideDownInfo {
    from { opacity: 0; transform: scale(0.95) translateY(-10px); max-height: 0; }
    to { opacity: 1; transform: scale(1) translateY(0); max-height: 200px; }
}
</style>

<template>
  <main class="container" style="padding-top: 160px; padding-bottom: 80px;">
    <div class="row shadow-lg rounded-4 overflow-hidden g-0" style="background: linear-gradient(135deg, rgba(245, 240, 232, 0.95) 0%, rgba(228, 219, 191, 0.9) 100%); backdrop-filter: blur(10px);">
      
      <!-- Columna de la Imagen -->
      <div class="col-md-7 d-none d-md-block p-0">
        <img src="/assets/img/herencia&cultivo.png" alt="Cosecha de Café" 
             class="img-fluid h-100 w-100 object-fit-cover">
      </div>

      <div class="col-md-5 p-4 p-md-5 contact-form-inner">
        <div class="mb-4 header-contact">
          <span class="coffee-badge mb-2 d-inline-block"><i class="fa-solid fa-mug-hot me-2"></i>Contacto Directo</span>
          <h2 style="font-family: 'Playfair Display', serif; color: var(--color-primary);" class="fw-bold display-6">Escríbenos</h2>
          <p class="text-muted lead-sm">Tu opinión es el aroma de nuestro servicio</p>
        </div>

        <form @submit.prevent="handleSubmit" class="row g-4" novalidate>
          <div class="col-12">
            <label class="form-label" for="name">Nombre</label>
            <div class="input-group-custom">
              <input 
                v-model="form.name"
                type="text" 
                class="form-control" 
                id="name" 
                name="name"
                placeholder="Tu nombre completo" 
                required
                :class="{ 'is-invalid': errors.name }"
              >
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="email">Correo Electrónico</label>
            <input 
              v-model="form.email"
              type="email" 
              class="form-control" 
              id="email" 
              name="email"
              placeholder="nombre@ejemplo.com" 
              required
              :class="{ 'is-invalid': errors.email }"
            >
            <div class="invalid-feedback">{{ errors.email }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="number">Teléfono</label>
            <input 
              v-model="form.number"
              type="tel" 
              class="form-control" 
              id="number" 
              name="number"
              placeholder="+57 300 000 0000" 
              :class="{ 'is-invalid': errors.number }"
            >
            <div class="invalid-feedback">{{ errors.number }}</div>
          </div>

          <div class="col-12">
            <label class="form-label" for="message">Mensaje</label>
            <textarea 
              v-model="form.message"
              class="form-control" 
              id="message" 
              name="message"
              rows="4" 
              required
              placeholder="Cuéntanos cómo podemos ayudarte o qué historia quieres compartir..."
              :class="{ 'is-invalid': errors.message }"
            ></textarea>
            <div class="invalid-feedback">{{ errors.message }}</div>
          </div>

          <div class="col-12 text-end mt-4">
            <button type="submit" class="btnEnviar btn w-100 w-md-auto text-uppercase">
              Enviar Mensaje <i class="bi bi-send-fill ms-2"></i>
            </button>
          </div>
        </form>
      </div>
      
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import Swal from 'sweetalert2';

// Estado del formulario
const form = reactive({
  name: '',
  email: '',
  number: '',
  message: ''
});

// Estado de errores
const errors = reactive({
  name: '',
  email: '',
  number: '',
  message: ''
});

// Lógica de Validación
const validate = () => {
  let isValid = true;
  
  // Limpiar errores
  Object.keys(errors).forEach(key => errors[key] = '');

  // Validar Nombre
  if (!form.name.trim()) {
    errors.name = "Ingresa tu nombre";
    isValid = false;
  } else if (form.name.length < 3) {
    errors.name = "Mínimo 3 caracteres";
    isValid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.name)) {
    errors.name = "Solo letras y espacios";
    isValid = false;
  }

  // Validar Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = "Ingresa tu email";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Email no válido";
    isValid = false;
  }

  // Validar Teléfono (opcional)
  if (form.number && (form.number.length < 10 || !/^[0-9+\s]+$/.test(form.number))) {
    errors.number = "Teléfono inválido (mín. 10 dígitos)";
    isValid = false;
  }

  // Validar Mensaje
  if (!form.message.trim()) {
    errors.message = "El mensaje no puede estar vacío";
    isValid = false;
  } else if (form.message.length < 10) {
    errors.message = "Mensaje demasiado corto (mín. 10)";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (validate()) {
    try {
      // Enviar a Formspree usando fetch
      const response = await fetch('https://formspree.io/f/xlgajpkq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        // Mostrar SweetAlert profesional con tema de café
        Swal.fire({
          title: '¡Mensaje Recibido!',
          text: 'Gracias por contactarnos. Tu mensaje ha sido recibido como una taza recién preparada. Te responderemos pronto con el mismo cuidado que ponemos en cada grano de café.',
          icon: 'success',
          confirmButtonText: 'Excelente',
          confirmButtonColor: '#532721',
          background: '#fdfcfb',
          color: '#532721',
          customClass: {
            popup: 'swal-coffee-popup',
            title: 'swal-coffee-title',
            confirmButton: 'swal-coffee-button'
          }
        });
        
        // Limpiar formulario tras éxito
        Object.keys(form).forEach(key => form[key] = '');
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      Swal.fire({
        title: '¡Ups!',
        text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo, como cuando se prepara una taza perfecta.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#532721'
      });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

:root {
  --color-primary: #532721;
  --color-primary-active: #3d1c18;
  --color-secondary: #B08D57;
  --color-secondary-muted: rgba(176, 141, 87, 0.6);
  --color-accent: #5F6335;
  --color-background: #E4DBBF;
  --color-text-default: #1A1A1A;
  --color-border-default: #B08D57;
}

/* FONDO */
:deep(body)::before {
    content: "";
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/img/background1.jpg') center/cover;
    background-attachment: fixed;
    opacity: 1;
    z-index: -1;
}

:deep(body) {
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* CENTRADO VERTICAL */
main.container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.shadow-lg {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25) !important;
}

/* Estilos del formulario inyectado */
.contact-form-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.header-contact {
    text-align: center;
}

/* Badge decorativo superior */
.coffee-badge {
    background-color: rgba(83, 39, 33, 0.1);
    color: var(--color-primary);
    padding: 6px 16px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
}

/* Inputs Premium */
.form-label {
    color: var(--color-primary);
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 6px;
    letter-spacing: 0.3px;
}

.form-control {
    background-color: #fdfcfb;
    border: 1.5px solid #e6dfd9;
    border-radius: 12px;
    padding: 12px 16px;
    color: #4a3b32;
    font-size: 0.95rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-control:hover {
    border-color: var(--color-secondary);
    background-color: #ffffff;
}

.form-control:focus {
    background-color: #ffffff;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 4px rgba(83, 39, 33, 0.15);
    outline: 0;
}

.form-control::placeholder {
    color: #a69a91;
    font-size: 0.9rem;
}

.form-control.is-invalid {
    border-color: #dc3545 !important;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

/* Botón de envío rediseñado */
.btnEnviar {
    background: var(--color-primary);
    color: white !important;
    font-weight: 600;
    letter-spacing: 1px;
    border: 2px solid transparent;
    border-radius: 50px;
    padding: 14px 35px;
    box-shadow: 0 6px 18px rgba(83, 39, 33, 0.25);
    transition: all 0.3s ease;
}

.btnEnviar:hover {
    background: var(--color-primary);
    color: #fdfcfb !important;
    border-color: var(--color-primary);
    transform: translateY(-3px);
    box-shadow: 0 10px 22px rgba(83, 39, 33, 0.35);
}

.btnEnviar:active {
    transform: translateY(-1px);
}

/* Validaciones de Error Estilizadas */
.invalid-feedback {
    font-size: 0.85rem;
    font-weight: 500;
    color: #dc3545;
    margin-top: 5px;
    padding-left: 4px;
    animation: slideDown 0.25s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* SweetAlert Custom Styles */
:deep(.swal-coffee-popup) {
    border-radius: 20px;
}

:deep(.swal-coffee-title) {
    color: var(--color-primary);
    font-family: 'Playfair Display', serif;
}

:deep(.swal-coffee-button) {
    border-radius: 50px;
    padding: 12px 30px;
}

/* Responsive */
@media (max-width: 767px) {
    main.container {
        padding: 20px;
        padding-top: 140px !important;
    }
    
    .col-md-5 {
        padding: 40px 25px !important;
    }
    
    .btnEnviar {
        width: 100% !important;
    }
}
</style>
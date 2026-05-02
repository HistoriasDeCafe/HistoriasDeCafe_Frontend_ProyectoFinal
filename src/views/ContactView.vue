<template>
  <section class="contact-section d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <!-- CARD CON EFECTO GLASSMORPISM -->
          <div class="contact-card shadow-lg">
            <div class="text-center mb-4">
              <h2 class="titulo-cafe">Contáctanos</h2>
              <p class="text-muted">¿Tienes dudas sobre nuestro café? <br> Estamos aquí para escucharte.</p>
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
              <!-- NOMBRE -->
              <div class="mb-3">
                <label for="name" class="form-label">Nombre Completo</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  id="name" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Tu nombre"
                >
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <!-- EMAIL -->
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  id="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="ejemplo@correo.com"
                >
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <!-- TELÉFONO -->
              <div class="mb-3">
                <label for="number" class="form-label">Teléfono / WhatsApp</label>
                <input 
                  v-model="form.number"
                  type="tel" 
                  id="number" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.number }"
                  placeholder="Mínimo 10 dígitos"
                >
                <div class="invalid-feedback">{{ errors.number }}</div>
              </div>

              <!-- MENSAJE -->
              <div class="mb-4">
                <label for="message" class="form-label">Mensaje</label>
                <textarea 
                  v-model="form.message"
                  id="message" 
                  rows="4" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.message }"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
                <div class="invalid-feedback">{{ errors.message }}</div>
              </div>

              <!-- BOTÓN ENVIAR -->
              <div class="text-center">
                <button type="submit" class="btn btnEnviar">
                  <i class="fa-solid fa-paper-plane me-2"></i> Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';

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

// Lógica de Validación (Migrada de tu JS original)
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
  } else if (!/^[a-zA-Z\s]+$/.test(form.name)) {
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

  // Validar Teléfono
  if (form.number.length < 10 || !/^[0-9+\s]+$/.test(form.number)) {
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

const handleSubmit = () => {
  if (validate()) {
    console.log("¡Formulario validado con éxito!", form);
    alert("¡Mensaje enviado con éxito! Pronto nos contactaremos contigo.");
    
    // Limpiar formulario tras éxito
    Object.keys(form).forEach(key => form[key] = '');
  }
};
</script>

<style scoped>
/* SECCIÓN Y FONDO */
.contact-section {
    min-height: 90vh;
    position: relative;
}

.titulo-cafe {
    color: #6f4e37;
    font-weight: 700;
    letter-spacing: -1px;
}

/* CARD GLASSMORPISM */
.contact-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(176, 141, 87, 0.2);
    border-radius: 25px;
    padding: 40px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

/* INPUTS ESTILIZADOS */
.form-label {
    color: #6f4e37;
    font-weight: 600;
    margin-left: 5px;
}

/* App.vue o ContactView.vue <style scoped> */

.form-control {
    background: rgba(255, 255, 255, 0.9);
    
    /* CAMBIO CLAVE: Borde sutil visible desde el inicio */
    border: 1px solid rgba(111, 78, 55, 0.3); 
    
    border-radius: 12px;
    padding: 12px 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #532721; /* Color de texto café oscuro para legibilidad */
}

/* Efecto al pasar el mouse por encima (antes de hacer clic) */
.form-control:hover {
    border-color: rgba(212, 163, 115, 0.7);
    background: #fff;
}

/* Efecto al hacer clic (Focus) */
.form-control:focus {
    background: #fff;
    
    /* Borde café sólido más fuerte */
    border-color: #6f4e37; 
    
    /* Sombra (glow) café para dar profundidad */
    box-shadow: 0 0 8px rgba(111, 78, 55, 0.2); 
    
    transform: translateY(-2px);
    outline: none; /* Quita el borde azul feo por defecto de Chrome */
}

/* Estilo para el placeholder (el texto de fondo) */
.form-control::placeholder {
    color: rgba(111, 78, 55, 0.5);
    font-size: 0.9rem;
}   

/* BOTÓN PROFESIONAL */
.btnEnviar {
    background: #6f4e37;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    padding: 12px 45px !important;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 8px 20px rgba(111, 78, 55, 0.3);
}

.btnEnviar:hover {
    background: #532721;
    transform: scale(1.08) translateY(-3px);
    box-shadow: 0 12px 25px rgba(111, 78, 55, 0.5);
    color: white;
}

/* FIX PARA EL FONDO EN VUE */
:deep(body)::before {
    content: "";
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: url('/assets/img/background1.jpg') center/cover;
    opacity: 0.15;
    z-index: -1;
}

/* Errores */
.invalid-feedback {
    font-weight: 500;
    margin-left: 5px;
    animation: shake 0.3s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
</style>
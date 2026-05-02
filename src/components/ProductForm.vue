<template>
  <div class="contenedor-admin">
    <h2 class="text-center mb-4">Carga de Café</h2>
    <form @submit.prevent="handleSubmit" novalidate>
      
      <!-- Nombre -->
      <div class="field-group">
        <input v-model="form.nombre" type="text" :class="{'is-invalid': errors.nombre}" 
               placeholder="Nombre del grano (Ej: Geisha)">
        <span v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</span>
      </div>

      <!-- Origen -->
      <div class="field-group">
        <input v-model="form.origen" type="text" :class="{'is-invalid': errors.origen}" 
               placeholder="Origen (Ej: Huila, Colombia)">
        <span v-if="errors.origen" class="invalid-feedback">{{ errors.origen }}</span>
      </div>

      <!-- Tostión -->
      <div class="field-group">
        <select v-model="form.tostado" :class="{'is-invalid': errors.tostado}">
          <option value="">Seleccionar tipo de tostión</option>
          <option value="Claro">Tostado Claro</option>
          <option value="Medio">Tostado Medio</option>
          <option value="Oscuro">Tostado Oscuro</option>
        </select>
        <span v-if="errors.tostado" class="invalid-feedback">{{ errors.tostado }}</span>
      </div>

      <!-- Estado -->
      <div class="field-group">
        <select v-model="form.estado" :class="{'is-invalid': errors.estado}">
          <option value="">Seleccionar estado</option>
          <option value="disponible">Disponible</option>
          <option value="no-disponible">No disponible</option>
        </select>
        <span v-if="errors.estado" class="invalid-feedback">{{ errors.estado }}</span>
      </div>

      <!-- Imagen -->
      <div class="field-group">
        <label class="form-label">Imagen del producto</label>
        <input type="file" @change="handleImageChange" accept="image/*" 
               :class="{'is-invalid': errors.imagen}">
        <span v-if="errors.imagen" class="invalid-feedback">{{ errors.imagen }}</span>
      </div>

      <!-- Stock y Precio -->
      <div class="row-flex">
        <div class="field-group flex-1">
          <input v-model.number="form.stock" type="number" placeholder="Stock" 
                 :class="{'is-invalid': errors.stock}">
          <span v-if="errors.stock" class="invalid-feedback">{{ errors.stock }}</span>
        </div>
        <div class="field-group flex-1">
          <input v-model.number="form.precio" type="number" placeholder="Precio" 
                 :class="{'is-invalid': errors.precio}">
          <span v-if="errors.precio" class="invalid-feedback">{{ errors.precio }}</span>
        </div>
      </div>

      <!-- Descripción -->
      <div class="field-group">
        <textarea v-model="form.descripcion" rows="3" placeholder="Notas de cata..." 
                  :class="{'is-invalid': errors.descripcion}"></textarea>
        <span v-if="errors.descripcion" class="invalid-feedback">{{ errors.descripcion }}</span>
      </div>

      <button type="submit" class="btn-submit">Agregar al Catálogo</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['save']);

// Estado inicial del formulario
const initialState = {
  nombre: '',
  origen: '',
  tostado: '',
  estado: '',
  imagen: '',
  stock: null,
  precio: null,
  descripcion: ''
};

const form = reactive({ ...initialState });
const errors = reactive({});

// Procesar imagen a Base64
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.imagen = event.target.result;
      delete errors.imagen; // Limpia error si carga imagen
    };
    reader.readAsDataURL(file);
  }
};

// Lógica de Validación (Igual a tu JS original)
const validateForm = () => {
  // Limpiar errores previos
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  if (form.nombre.trim().length < 3) {
    errors.nombre = 'Nombre obligatorio (mín. 3 caracteres)';
    isValid = false;
  }
  if (form.origen.trim().length < 3) {
    errors.origen = 'Origen obligatorio (mín. 3 caracteres)';
    isValid = false;
  }
  if (!form.tostado) {
    errors.tostado = 'Selecciona un tipo de tostión';
    isValid = false;
  }
  if (!form.estado) {
    errors.estado = 'Selecciona el estado';
    isValid = false;
  }
  if (!form.imagen) {
    errors.imagen = 'Debes cargar una imagen';
    isValid = false;
  }
  if (form.stock === null || form.stock < 0) {
    errors.stock = 'Stock no válido';
    isValid = false;
  }
  if (form.precio === null || form.precio <= 0) {
    errors.precio = 'Precio debe ser mayor a 0';
    isValid = false;
  }
  if (form.descripcion.trim().length < 10) {
    errors.descripcion = 'Descripción demasiado corta (mín. 10)';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    // Si es válido, emitimos el objeto al padre
    emit('save', { ...form, id: Date.now() });
    
    // Reset del formulario (incluyendo el estado de la imagen)
    Object.assign(form, initialState);
  }
};
</script>

<style scoped>
/* Integrando tus estilos con mejoras de espaciado */
.field-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
}

.row-flex {
  display: flex;
  gap: 10px;
}

.flex-1 { flex: 1; }

.is-invalid {
  border-color: #f86d7b !important;
}

.invalid-feedback {
  color: #f86d7b;
  font-size: 0.8rem;
  margin-top: 4px;
  font-weight: 500;
}

.btn-submit {
  width: 100%;
  background-color: #6f4e37;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.btn-submit:hover {
  background-color: #5d4037;
}
</style>
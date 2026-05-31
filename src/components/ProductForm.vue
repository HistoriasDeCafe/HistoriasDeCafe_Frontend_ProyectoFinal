<template>
  <div class="contenedor-admin">
    <h2 class="text-center mb-4">{{ isEditMode ? 'Editar Producto' : 'Carga de Café' }}</h2>
    <form @submit.prevent="handleSubmit" novalidate>
      
      <!-- Nombre (Marca) -->
      <div class="field-group">
        <input v-model="form.nombre" type="text" :class="{'is-invalid': errors.nombre}" 
               placeholder="Marca (Ej: Geisha)">
        <span v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</span>
      </div>

      <!-- Origen (Finca) -->
      <div class="field-group">
        <input v-model="form.origen" type="text" :class="{'is-invalid': errors.origen}" 
               placeholder="Finca de origen">
        <span v-if="errors.origen" class="invalid-feedback">{{ errors.origen }}</span>
      </div>

      <!-- Tostión -->
      <div class="field-group">
        <select v-model="form.tostado" :class="{'is-invalid': errors.tostado}">
          <option value="" disabled selected>Seleccionar tipo de tostión</option>
          <option value="TOSTADO_CLARO">Tostado Claro</option>
          <option value="TOSTADO_MEDIO">Tostado Medio</option>
          <option value="TOSTADO_OSCURO">Tostado Oscuro</option>
        </select>
        <span v-if="errors.tostado" class="invalid-feedback">{{ errors.tostado }}</span>
      </div>

      <!-- Región (CategoryId) -->
      <div class="field-group">
        <select v-model="form.region" :class="{'is-invalid': errors.region}">
          <option value="" disabled selected>Seleccionar región colombiana</option>
          <option value="1">Región Andina (Eje Cafetero, Huila, Santander, etc.)</option>
          <option value="2">Región Caribe (Sierra Nevada, Perijá)</option>
          <option value="3">Región Pacífica</option>
          <option value="4">Región de la Orinoquía</option>
          <option value="5">Región de la Amazonía</option>
        </select>
        <span v-if="errors.region" class="invalid-feedback">{{ errors.region }}</span>
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
          <input v-model.number="form.stock" type="number" placeholder="Cantidad en inventario (Stock)" 
                 :class="{'is-invalid': errors.stock}">
          <span v-if="errors.stock" class="invalid-feedback">{{ errors.stock }}</span>
        </div>
        <div class="field-group flex-1">
          <input v-model.number="form.precio" type="number" placeholder="Precio unidad (COP)" 
                 :class="{'is-invalid': errors.precio}">
          <span v-if="errors.precio" class="invalid-feedback">{{ errors.precio }}</span>
        </div>
      </div>

      <!-- Descripción -->
      <div class="field-group">
        <textarea v-model="form.descripcion" rows="3" placeholder="Notas de cata (Ej: Notas frutales, acidez cítrica, jazmín)" 
                  :class="{'is-invalid': errors.descripcion}"></textarea>
        <span v-if="errors.descripcion" class="invalid-feedback">{{ errors.descripcion }}</span>
      </div>

      <button type="submit" class="btn-submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Procesando...' : (isEditMode ? 'Actualizar Producto' : 'Agregar al Catálogo') }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
  productToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

const isEditMode = ref(false);

// Estado inicial del formulario
const initialState = {
  nombre: '',
  origen: '',
  tostado: '',
  region: '',
  imagen: '',
  stock: null,
  precio: null,
  descripcion: ''
};

const form = reactive({ ...initialState });
const errors = reactive({});
const isSubmitting = ref(false);
const imageFile = ref(null);
const existingImageUrl = ref('');
const productId = ref(null);

// Cargar datos del producto cuando se está en modo edición
watch(() => props.productToEdit, (newProduct) => {
  console.log('ProductForm watch - productToEdit changed:', newProduct);
  if (newProduct) {
    console.log('Product ID recibido (id):', newProduct.id);
    console.log('Product ID recibido (id_product):', newProduct.id_product);
    console.log('Product ID recibido (idProduct):', newProduct.idProduct);
    console.log('Todos los campos:', Object.keys(newProduct));
    
    isEditMode.value = true;
    productId.value = newProduct.idProduct || newProduct.id_product || newProduct.id;
    console.log('productId.value establecido:', productId.value);
    form.nombre = newProduct.nombre || '';
    form.origen = newProduct.origen || '';
    form.tostado = newProduct.tostado || '';
    form.region = newProduct.region || '';
    form.stock = newProduct.stock || null;
    form.precio = newProduct.precio || null;
    form.descripcion = newProduct.descripcion || '';
    existingImageUrl.value = newProduct.imagen || '';
  } else {
    isEditMode.value = false;
    productId.value = null;
    Object.assign(form, initialState);
    existingImageUrl.value = '';
  }
}, { immediate: true });

// Procesar imagen
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    delete errors.imagen;
  }
};

// Cancelar edición
const handleCancel = () => {
  emit('cancel');
};

// Lógica de Validación
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  if (form.nombre.trim().length < 3) {
    errors.nombre = 'El nombre del producto es obligatorio (mín. 3 caracteres)';
    isValid = false;
  }
  if (form.origen.trim().length < 3) {
    errors.origen = 'La finca de origen es obligatoria (mín. 3 caracteres)';
    isValid = false;
  }
  if (!form.tostado) {
    errors.tostado = 'Selecciona un tipo de tostión';
    isValid = false;
  }
  if (!form.region) {
    errors.region = 'Selecciona la región del café';
    isValid = false;
  }
  if (!imageFile.value && !existingImageUrl.value) {
    errors.imagen = 'Debes cargar una imagen';
    isValid = false;
  }
  if (form.stock === null || form.stock === '' || parseInt(form.stock) < 0) {
    errors.stock = 'El stock no puede ser negativo';
    isValid = false;
  }
  if (form.precio === null || form.precio === '' || parseFloat(form.precio) <= 0) {
    errors.precio = 'El precio debe ser mayor a 0';
    isValid = false;
  }
  if (form.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    isValid = false;
  }

  return isValid;
};

// Subir imagen a Cloudinary
const uploadImageToCloudinary = async (file) => {
  const CLOUD_NAME = 'dg6oyckab';
  const UPLOAD_PRESET = 'historias_de_cafe';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Error al subir la imagen a Cloudinary');

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // Subir imagen a Cloudinary solo si se seleccionó una nueva
    let imageUrl = existingImageUrl.value;
    if (imageFile.value) {
      imageUrl = await uploadImageToCloudinary(imageFile.value);
    }

    // Crear payload para el backend
    const productPayload = {
      id: productId.value,
      name: form.nombre.trim(),
      origin: form.origen.trim(),
      roast: form.tostado,
      description: form.descripcion.trim(),
      price: parseFloat(form.precio),
      stock: parseInt(form.stock),
      categoryId: Number(form.region),
      imagen: imageUrl,
      isEditMode: isEditMode.value
    };

    // Emitir al padre para que haga la llamada a la API
    emit('save', productPayload);

    // Reset del formulario solo en modo creación
    if (!isEditMode.value) {
      Object.assign(form, initialState);
      imageFile.value = null;
      existingImageUrl.value = '';
    }

  } catch (error) {
    Swal.fire({
      icon: 'error',
      iconColor: '#d93025',
      title: 'Error',
      text: error.message || 'No se pudo procesar la imagen',
      confirmButtonColor: '#532721'
    });
  } finally {
    isSubmitting.value = false;
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
  background-color: var(--color-primary, #532721);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-primary-active, #3d1c18);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
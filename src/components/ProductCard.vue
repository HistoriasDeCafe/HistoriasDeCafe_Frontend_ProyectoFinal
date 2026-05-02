<template>
  <article class="card">
    <div class="image-placeholder">
      <img :src="producto.imagen" :alt="producto.nombre" @error="handleImageError">
    </div>
    <div class="card-content">
      <h3>{{ producto.nombre }}</h3>
      <p class="finca">{{ producto.origen || producto.finca }}</p>
      <div class="stars">★★★★★</div>
      <p class="description">{{ producto.descripcion }}</p>
      <p class="price">${{ Number(producto.precio).toLocaleString() }}</p>
      <div class="card-buttons">
        <button class="btn-cart" @click="$emit('add-to-cart', producto)">AÑADIR AL CARRITO</button>
        <button class="btn-detail">👁️ MOSTRAR DETALLE</button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps(['producto']);
defineEmits(['add-to-cart']);

// Fallback por si la ruta de la imagen no existe
const handleImageError = (e) => {
  e.target.src = 'https://placehold.co';
};
</script>

<style scoped>
/* Aquí va el CSS de la .card que pasaste al principio */
.card {
    border: 1px solid #e0e0e0; 
    border-radius: 12px;
    background-color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.image-placeholder { width: 100%; height: 220px; background-color: #f8f5f2; display: flex; justify-content: center; align-items: center; padding: 15px; }
.card img { max-width: 100%; height: 100%; object-fit: contain; }
.card-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
.card-content h3 { font-size: 18.4px; margin: 0 0 5px 0; color: #2c1a0f; font-weight: 700; }
.finca { font-size: 0.85rem; color: #6d4c41; margin-bottom: 8px; font-weight: 600; }
.stars { color: #f1c40f; font-size: 0.8rem; margin-bottom: 10px; }
.description { font-size: 13.6px; color: #555; line-height: 1.4; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.price { font-weight: 800; font-size: 1.25rem; color: #1a1a1a; padding-bottom: 15px; }
.card-buttons { display: flex; flex-direction: column; gap: 8px; }
.btn-cart { background-color: #3e2723; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600; text-transform: uppercase; }
.btn-detail { background-color: #f0f0f0; color: #333; border: none; padding: 10px; border-radius: 6px; cursor: pointer; }
</style>

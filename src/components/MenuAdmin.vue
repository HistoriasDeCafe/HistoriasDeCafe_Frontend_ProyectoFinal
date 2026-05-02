<template>
  <aside class="sidebar">
    <div class="logo-section">
      <span>Módulo Administrativo</span>
      <img src="/assets/img/logo.png" alt="Admin">
    </div>
    <nav>
      <ul>
        <li 
          v-for="item in menuItems" 
          :key="item.view"
          :class="{ active: modelValue === item.view }"
          @click="$emit('update:modelValue', item.view)"
        >
          <i :class="item.icon"></i>
          <span>{{ item.view }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);

const menuItems = [
  { view: 'Dashboard', icon: 'bi bi-speedometer2' },
  { view: 'Productos', icon: 'bi bi-box-seam' },
  { view: 'Ordenes', icon: 'bi bi-receipt' },
  { view: 'Usuarios', icon: 'bi bi-people' },
  { view: 'Configuración', icon: 'bi bi-gear' }
];
</script>

<style scoped>
.sidebar {
  width: 160px;
  background-color: #532721; /* var(--color-primary) */
  border-right: 2px solid #B08D57; /* var(--color-secondary) */
  min-height: 100vh;
}
.logo-section {
  display: flex; flex-direction: column; align-items: center; padding: 1.5rem 1rem; border-bottom: 1px solid rgba(228, 219, 191, 0.2);
}
.logo-section img { width: 90px; order: 2; }
.logo-section span { order: 1; color: #E4DBBF; font-weight: 600; font-size: 0.95rem; }
ul { list-style: none; padding: 0; }
li {
  display: flex; align-items: center; gap: 0.75rem; padding: 12px 15px; cursor: pointer;
  color: #E4DBBF; transition: all 0.2s;
}
li:hover { background: #3d1c18; }
li.active { background: #B08D57; color: #532721; font-weight: 600; }
</style>
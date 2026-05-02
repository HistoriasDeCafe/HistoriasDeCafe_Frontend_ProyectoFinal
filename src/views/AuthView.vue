<template>
  <div class="auth-page">
    <!-- Fondo Animado -->
    <div class="hero-background">
      <img src="/assets/img/gifBackground.gif" alt="Finca de Café" class="bg-image-anim">
      <div class="overlay"></div>
    </div>

    <main class="main-content">
      <div class="container-auth">
        <!-- Sección de Marca -->
        <div class="brand-section">
          <div class="brand-content">
            <h1>Historias de Café</h1>
            <p>Conectamos paladares exigentes con el corazón de la montaña. Tu viaje al origen comienza aquí.</p>
          </div>
        </div>

        <!-- Glassmorphism Card -->
        <div class="auth-wrapper">
          <div class="glass-card">
            <!-- Renderizado condicional según el modo -->
            <LoginComponent v-if="isLogin" @switch="isLogin = false" />
            <RegisterComponent v-else @switch="isLogin = true" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoginComponent from '../components/auth/Login.vue';
import RegisterComponent from '../components/auth/Register.vue';

const isLogin = ref(true); // Controla si mostramos Login o Registro
</script>

<style scoped>
.auth-page { height: 100vh; overflow: hidden; position: relative; }
.hero-background { position: fixed; inset: 0; z-index: -1; }
.bg-image-anim { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(62, 39, 35, 0.8) 0%, transparent 100%); }
.main-content { display: flex; align-items: center; justify-content: center; height: 100vh; }
.container-auth { display: flex; width: 85%; max-width: 1100px; align-items: center; }
.brand-section { flex: 1; color: white; padding-right: 60px; }
.brand-section h1 { font-size: 3.5rem; text-shadow: 2px 2px 8px rgba(0,0,0,0.5); }
/* Dentro de AuthView.vue */
.glass-card {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    width: 400px; /* Tamaño fijo para que no se vea "raro" */
    min-height: 500px; 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

</style>

<template>
  <div class="auth-page">
    <div class="hero-background">
      <img src="/assets/img/userBackground.png" alt="Finca de Café" class="bg-image-anim">
      <div class="overlay"></div>
    </div>

    <main class="main-content">
      <div class="container">
        <div class="brand-section">
          <div class="brand-content">
            <h1>Historias de Café</h1>
            <p>Conectamos paladares exigentes con el corazón de la montaña. Tu viaje al origen comienza aquí.</p>
          </div>
        </div>

        <div class="auth-wrapper">
          <div class="glass-card">
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
.auth-page {
    height: 100vh;
    overflow: hidden;
    position: relative;
}

.hero-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.bg-image-anim {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.65);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(44, 26, 17, 0.75) 0%, rgba(0, 0, 0, 0.2) 100%);
    z-index: 1;
}

.main-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
}

.container {
    display: flex;
    width: 90%;
    max-width: 1200px;
    align-items: center;
    justify-content: space-between;
    gap: 50px;
}

@media (max-width: 768px) {
    .container { flex-direction: column; text-align: center; }
    .brand-section { padding-right: 0 !important; margin-bottom: 30px; }
}

.brand-section {
    flex: 1;
    color: var(--crema-clara, #FAF6F0);
    padding-right: 40px;
}

.brand-section h1 {
    font-size: 4rem;
    font-family: 'Playfair Display', serif;
    margin-bottom: 20px;
    font-weight: 700;
    letter-spacing: -1px;
    text-shadow: 2px 4px 8px rgba(244, 242, 242, 0.3);
    color: aliceblue;
}

.brand-section p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: aliceblue;
    text-shadow: 1px 2px 4px rgba(250, 247, 247, 0.3);
}

.auth-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
}

.glass-card {
    background: var(--glass-bg, rgba(255, 255, 255, 0.12));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
    border-radius: 24px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.25);
    color: var(--espresso, #3E2723);
    overflow: hidden;
    transition: all 0.4s ease;
}
</style>

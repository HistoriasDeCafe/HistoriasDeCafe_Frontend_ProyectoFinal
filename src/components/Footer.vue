<template>
  <footer class="footer-custom">
    <div class="container py-5">
      <div class="row align-items-start">

        <!-- LOGO + DESCRIPCIÓN -->
        <div class="col-md-4 mb-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img src="/assets/img/logo-dark.svg" alt="logo" class="footer-logo">
            <!-- <h5 class="footer-title mb-0">Historias de Café</h5> -->
          </div>

          <p class="footer-text">
            Cada grano tiene un origen, cada taza cuenta un viaje.
            Transformamos el aroma en recuerdos y el tostado en arte.
          </p>

          <div class="footer-social mt-3">
            <i class="bi bi-facebook"></i>
            <i class="bi bi-instagram"></i>
            <i class="bi bi-tiktok"></i>
          </div>
        </div>

        <!-- NAVEGACIÓN -->
        <div class="col-md-4 mb-4">
          <h6 class="footer-subtitle">Navegación</h6>
          <ul class="footer-links">
            <li><router-link to="/nosotros">Acerca de Nosotros</router-link></li>
            <li><router-link to="/contacto">Contáctanos</router-link></li>
          </ul>
        </div>

        <!-- EXTRA / FRASE -->
        <div class="col-md-4 mb-4">
          <h6 class="footer-subtitle">Nuestra esencia</h6>
          <p class="footer-text">
            Café con propósito, origen y tradición colombiana ☕
          </p>
        </div>

      </div>

      <hr class="footer-line">

      <div class="d-flex justify-content-between flex-wrap footer-bottom">
        <span>© {{ currentYear }} Historias de Café</span>
        <span>Cultivado con pasión ❤️</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Lógica para que el año sea siempre el actual
const currentYear = new Date().getFullYear();
</script>

<style scoped>


.footer-custom {
width: 100%;
    margin: 0;
    position: relative;
    background: linear-gradient(
        135deg,
        var(--color-primary),
        #3d1c18
    );
    overflow: hidden;
}

.footer-custom::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5%;
    background: linear-gradient(
        90deg,
        transparent,
        var(--color-secondary),
        transparent
    );
}

.footer-custom::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 0;
}

.footer-custom .container {
    position: relative;
    z-index: 1;
}

.footer-text {
    color: #ddd;
    font-size: 0.95rem;
    line-height: 1.5;
}

.footer-links a {
    text-decoration: none;
    color: rgba(255,255,255,0.8);
    transition: 0.3s;
}

.footer-links a:hover {
    color: var(--color-secondary);
    padding-left: 5px;
}

.footer-links li {
    margin-bottom: 8px;
}

.footer-links {
    list-style: none;
    padding: 0;
}

/* .footer-logo {
    width: 55px;
    height: 55px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid var(--color-secondary);
    transition: 0.4s ease;
} */

.footer-logo:hover {
    box-shadow: 
        0 0 15px var(--color-secondary),
        0 0 30px rgba(176,141,87,0.5);
}

.footer-title {
    font-family: var(--font-family-display);
    font-weight: 600;
    color: white; /* Aseguramos visibilidad */
}

.footer-subtitle {
    color: var(--color-secondary);
    font-weight: 600;
    margin-bottom: 10px;
}

.footer-social i {
    font-size: 1.3rem;
    margin-right: 12px;
    color: white;
    transition: 0.3s;
    cursor: pointer;
}

.footer-social i:hover {
    color: var(--color-secondary);
    transform: translateY(-4px) scale(1.2);
    text-shadow: 0 0 10px rgba(176,141,87,0.7);
}

.footer-social i:active {
    transform: scale(0.95);
}

.footer-line {
    border-color: rgba(255,255,255,0.1);
}

.footer-bottom {
    font-size: 0.9rem;
    color: #bbb;
}
</style>

<template>
  <!-- HERO SECTION -->
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">Nuestra Historia</h1>
      <p class="hero-subtitle">Conectando familias caficultoras directamente con tu taza</p>
    </div>
  </section>

  <!-- VALORES SECTION -->
  <section class="values-section">
    <div class="container">
      <h2 class="section-title">Nuestros Valores</h2>
      <div class="values-grid">
        <div class="value-card">
          <div class="value-icon">💰</div>
          <h3>Justicia Económica</h3>
          <p>Maximizamos los ingresos directos de los productores, garantizando precios honestos y justos.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">🌱</div>
          <h3>Sostenibilidad Cultural</h3>
          <p>Preservamos la herencia cafetera, honrando el trabajo manual y artesanal de las familias.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">🔍</div>
          <h3>Trazabilidad Total</h3>
          <p>Conexión real y transparente desde la familia, la finca hasta la taza de café.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- MISION SECTION -->
  <section class="mission-section">
    <div class="container">
      <div class="mission-grid">
        <div class="mission-card">
          <h3>Nuestra Razón de Ser</h3>
          <p>Dignificamos la labor de las familias caficultoras eliminando intermediarios y garantizando que cada grano cuente.</p>
        </div>
        <div class="mission-card">
          <h3>Trazabilidad del Cultivo a la Taza</h3>
          <p>Garantizamos transparencia total en cada grano desde la cosecha hasta el tostado, conectando origen y destino.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- IMPACT SECTION -->
  <section class="impact-section">
    <div class="container">
      <div class="impact-content">
        <h2 class="impact-title">Nuestro Impacto</h2>
        <p class="impact-text">Construimos un ecosistema de equidad y reconocimiento para el campo colombiano, transformando vidas a través del comercio justo.</p>
      </div>
    </div>
  </section>

  <!-- TEAM SECTION -->
  <section class="team-section">
    <div class="container">
      <h2 class="section-title">Nuestro Equipo</h2>
      <p class="section-subtitle">Los apasionados detrás de cada taza de café</p>
      
      <div class="team-grid">
        <div v-for="(persona, index) in equipo" :key="index" class="team-card">
          <div class="team-avatar">
            <img :src="persona.foto" :alt="persona.nombre">
          </div>
          <div class="team-info">
            <h3 class="team-name">{{ persona.nombre }}</h3>
            <p class="team-role">{{ persona.rol }}</p>
            <p class="team-description">{{ persona.descripcion }}</p>
            <div class="team-social">
              <a :href="persona.linkedin" target="_blank" class="social-link" title="LinkedIn">
                <i class="fa-brands fa-linkedin"></i>
              </a>
              <a :href="persona.github" target="_blank" class="social-link" title="GitHub">
                <i class="fa-brands fa-github"></i>
              </a>
              <a :href="persona.portfolio" target="_blank" class="social-link" title="Portafolio">
                <i class="fa-solid fa-briefcase"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const equipo = ref([
  {
    nombre: "Maira Alejandra Pinilla",
    rol: "Full Stack & Scrum Master",
    descripcion: "Apasionada por crear experiencias digitales únicas combinando diseño y tecnología.",
    foto: "/assets/img/PerfilAle.png",
    linkedin: "https://www.linkedin.com/in/maira-alejandra-pinilla-pinilla-ingenieria-de-sistemas-desarrolladora/",
    github: "https://github.com/Malejandrapin",
    portfolio: "https://malejandrapin.github.io/Alejandra-Pinilla-Portafolio/"
  },
  {
    nombre: "Andrés Díaz Figueroa",
    rol: "Java Full Stack Junior",
    descripcion: "Apasionado por la tecnología, el desarrollo de software y la arquitectura cloud.",
    foto: "/assets/img/fotoAndres-removebg-preview.png",
    linkedin: "https://www.linkedin.com/in/andres-diaz-figueroa-tecnology-innovation-developer-cloud/",
    github: "https://github.com/andresdiazf",
    portfolio: "https://myportfolio-andres-diaz-figueroa.vercel.app/"
  },
  {
    nombre: "Didier Cuan Najas",
    rol: "Full Stack Developer",
    descripcion: "Analista y desarrollador apasionado por tecnología backend y frontend.",
    foto: "/assets/img/fotoDidier .png",
    linkedin: "https://www.linkedin.com/in/didier-alexis-cuan-najas-developer-full-stack/",
    github: "https://github.com/didierNajas",
    portfolio: "https://didiernajas.github.io/Basic-portafolio/"
  },
  {
    nombre: "Zully Tamayo Martinez",
    rol: "Ingeniera Informática y Desarrolladora",
    descripcion: "Apasionada por construir soluciones eficientes y lógica de backend robusta.",
    foto: "/assets/img/fotoZully.png",
    linkedin: "https://www.linkedin.com/in/zully-tamayo-martinez-softwaredeveloper",
    github: "https://github.com/zullytamayom",
    portfolio: "https://phenomenal-eclair-9360d4.netlify.app/"
  }
]);
</script>

<style scoped>
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

/* --- HERO SECTION --- */
.hero-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  padding: 180px 40px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-top: 0;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/img/background1.jpg') center/cover;
  opacity: 0.15;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  line-height: 1.6;
}

/* --- VALUES SECTION --- */
.values-section {
  padding: 80px 40px;
  background: linear-gradient(180deg, #ffffff 0%, var(--color-background) 100%);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-default);
  text-align: center;
  margin-bottom: 50px;
  opacity: 0.8;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.value-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(83, 39, 33, 0.1);
  border: 2px solid rgba(176, 141, 87, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(83, 39, 33, 0.2);
  border-color: var(--color-secondary);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.value-card h3 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 15px;
  font-weight: 700;
}

.value-card p {
  font-size: 1rem;
  color: var(--color-text-default);
  line-height: 1.7;
  opacity: 0.85;
}

/* --- MISSION SECTION --- */
.mission-section {
  padding: 80px 40px;
  background: white;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.mission-card {
  background: linear-gradient(135deg, rgba(176, 141, 87, 0.08) 0%, rgba(176, 141, 87, 0.02) 100%);
  border-radius: 16px;
  padding: 40px;
  border-left: 4px solid var(--color-secondary);
  transition: all 0.3s ease;
}

.mission-card:hover {
  background: linear-gradient(135deg, rgba(176, 141, 87, 0.12) 0%, rgba(176, 141, 87, 0.05) 100%);
  transform: translateX(8px);
}

.mission-card h3 {
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-bottom: 15px;
  font-weight: 700;
}

.mission-card p {
  font-size: 1.1rem;
  color: var(--color-text-default);
  line-height: 1.8;
  opacity: 0.85;
}

/* --- IMPACT SECTION --- */
.impact-section {
  padding: 100px 40px;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  text-align: center;
}

.impact-content {
  max-width: 900px;
  margin: 0 auto;
}

.impact-title {
  font-size: 2.8rem;
  color: white;
  margin-bottom: 25px;
  font-weight: 800;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.impact-text {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  font-weight: 500;
}

/* --- TEAM SECTION --- */
.team-section {
  padding: 100px 40px;
  background: linear-gradient(180deg, var(--color-background) 0%, #ffffff 100%);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  justify-content: center;
}

.team-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(83, 39, 33, 0.1);
  border: 2px solid rgba(176, 141, 87, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.team-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(83, 39, 33, 0.2);
  border-color: var(--color-secondary);
}

.team-avatar {
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--color-secondary);
  box-shadow: 0 8px 20px rgba(176, 141, 87, 0.3);
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
}

.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  transition: transform 0.4s ease;
}

.team-card:hover .team-avatar img {
  transform: scale(1.1);
}

.team-name {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 8px;
  font-weight: 700;
}

.team-role {
  font-size: 0.95rem;
  color: var(--color-secondary);
  margin-bottom: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.team-description {
  font-size: 0.95rem;
  color: var(--color-text-default);
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.85;
}

.team-social {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-secondary);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: 1.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.social-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(83, 39, 33, 0.3);
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .values-grid,
  .mission-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .impact-title {
    font-size: 2rem;
  }
  
  .impact-text {
    font-size: 1.1rem;
  }
}
</style>
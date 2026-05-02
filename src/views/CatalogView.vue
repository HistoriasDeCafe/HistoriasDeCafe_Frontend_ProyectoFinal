<template>
  <main>
    <h2 class="title">CAFÉS DISPONIBLES</h2>
    <section class="grid-container">
      <ProductCard
        v-for="(prod, index) in listaCompleta"
        :key="index"
        :producto="prod"
        @add-to-cart="agregarAlCarrito"
      />
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ProductCard from "../components/ProductCard.vue";

const productosEstaticos = ref([
  {
    nombre: "Neblina Dorada",
    origen: "Finca El Recuerdo",
    descripcion:
      "Edición limitada de Pacamara, procesada mediante el método honey...",
    precio: 32000,
    imagen: "/assets/imgProductos/auroraFloral.png",
  },
  {
    nombre: "Café Sol Levante",
    origen: "Finca Miravalles",
    descripcion:
      "Un Geisha de tueste medio que captura la esencia del amanecer...",
    precio: 26000,
    imagen: "/assets/imgProductos/solLevante.png",
  },
  {
    nombre: "Café Brisa Marina",
    origen: "Finca Costa Azul",
    descripcion:
      "Cultivado cerca de la costa, este Bourbon Azul absorbe la esencia marina...",
    precio: 23000,
    imagen: "/assets/imgProductos/brisaMarina.png",
  },
  {
    nombre: "Café Esencia Ancestral",
    origen: "Lote Herencia",
    descripcion:
      "Un Arábica Criollo procesado naturalmente que honra la herencia maya...",
    precio: 21000,
    imagen: "/assets/imgProductos/esenciaAncestral.png",
  },
  {
    nombre: "Volcán Fuego",
    origen: "Finca Quemada",
    descripcion: "Intenso y ahumado, con la fuerza de los suelos volcánicos...",
    precio: 28000,
    imagen: "/assets/imgProductos/volcanFuego.png",
  },
  {
    nombre: "Café Selva Bioma",
    origen: "Finca El Tucán",
    descripcion:
      "Un café ético cultivado bajo la sombra nativa de la selva tropical. Su perfil es ligero y afrutado, con sutiles notas de bayas silvestres y acidez brillante. Biodegradable.",
    precio: 18000,
    imagen: "/assets/imgProductos/selvaBioma.png",
  },
  {
    nombre: "Café Cosecha Nocturna",
    origen: "Finca Luna Llena",
    descripcion:
      "Un Pacamara místico cosechado bajo la luz de la luna llena. Este tueste lento y oscuro intensifica sus sabores, revelando notas ricas de ciruela pasa y cacao negro amargo.",
    precio: 24000,
    imagen: "/assets/imgProductos/cosechaNocturna.png",
  },
  {
    nombre: "Café Aurora Floral",
    origen: "Finca Los Jazmines",
    descripcion:
      "Un Geisha de proceso lavado increíblemente aromático. Su tueste ligero resalta un ramo floral complejo con notas distintivas de jazmín y flor de melocotón.",
    precio: 30000,
    imagen: "/assets/imgProductos/auroraFloral.png",
  },
  {
    nombre: "Café Montaña mística",
    origen: "Finca Las Nubes",
    descripcion:
      "Cultivado a alturas extremas donde la niebla matutina acaricia los frutos. Este Pacamara Miel ofrece una dulzura sedosa con notas de albaricoque seco y azúcar morena.",
    precio: 26000,
    imagen: "/assets/imgProductos/montanaMistica.png",
  },
  {
    nombre: "Café Aurora Floral Rosada",
    origen: "Finca Los Jazmines",
    descripcion:
      "Como un amanecer en un jardín, este café captura aromas florales delicados. Es un Geisha ligero, suave y elegante, con notas sutiles de rosa y bergamota.",
    precio: 28000,
    imagen: "/assets/imgProductos/auroraFloralRosada.png",
  },
]);

const productosAdmin = ref([]);

onMounted(() => {
  const storage = localStorage.getItem("productos");
  if (storage) {
    productosAdmin.value = JSON.parse(storage); // Usamos .value para actualizar el ref
  }
});

const listaCompleta = computed(() => {
  return [...productosEstaticos.value, ...productosAdmin.value];
});

const agregarAlCarrito = (producto) => {
  console.log("Agregando:", producto.nombre);
};
</script>

<style scoped>
.title {
  text-align: center;
  margin: 40px 0;
  color: #3e2723;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  padding: 20px 0;
  margin: 0 25px;
}
</style>

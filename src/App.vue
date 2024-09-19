<script setup lang="ts">
import RecuperationJobs from "./components/RecuperationJobs.vue";
import logo from "./assets/logoBoillot.jpg"; // Importer l'image
</script>

<template>
  <header>
    <p>Prenez Rendez-Vous avec</p>
    <img :src="logo" alt="Exemple d'image" />
  </header>
  <RecuperationJobs />
  <footer>
    En cas de problème pour fixer le rendez-vous contactez nous au 06 06 06 06
    06
  </footer>
</template>

<style scoped>
p{
  font-family: 'Swiss', sans-serif;

}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px 0;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  font-size: 3em;
}

header > p {
  margin-top: 2em;
}
</style>

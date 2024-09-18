<template>
  <div @click="scheduleJob()" class="creneauRdv">
    <p>{{ formatDate(jobInfo.date) }}</p>
  </div>

  <div v-if="loading" class="overlay">
    <div class="spinner"></div>
  </div>

  <div v-if="showPopIn" class="popin-overlay">
    <div class="popin-content">
      <h2>Votre Rendez-Vous a été fixé</h2>
      <p>
        <b>{{ formatDate(jobInfo.date) }}</b>
      </p>
      <button @click="closePopIn">Fermer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SchedulingJobInfo } from "../types/JobTypes";

const props = defineProps<{ jobInfo: SchedulingJobInfo }>();
const scheduleJobAPIUrl = `/.netlify/functions/schedule-job`;
const loading = ref<boolean>(false);
const showPopIn = ref<boolean>(false);

const scheduleJob = async () => {
  loading.value = true;
  var formatedDate = remplacerEspaces(props.jobInfo.date);
  const params = new URLSearchParams({
    jobId: props.jobInfo.jobId.toString(),
    jobRef: props.jobInfo.jobRef,
    resourceId: props.jobInfo.resourceId.toString(),
    resourceRef: props.jobInfo.resourceReference,
    scheduleDate: formatedDate,
    durationMins: props.jobInfo.durationMins,
  });

  try {
    const response = await fetch(`${scheduleJobAPIUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }

    const result = await response.json();
    console.log(
      "FRONT  schedule Received        ------" + JSON.stringify(result)
    );
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
    showPopIn.value = true;
  }
};
const closePopIn = () => {
  showPopIn.value = false;
};

function formatDate(dateStr: string): string {
  // Dictionnaire des jours de la semaine et des mois en français
  const daysOfWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // Convertir la chaîne en objet Date
  const date = new Date(dateStr.replace(" ", "T")); // Remplacement de l'espace par un 'T' pour rendre la chaîne compatible avec le constructeur Date

  // Extraire les différentes parties de la date
  const dayName = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extraire l'heure et les minutes
  const hours = date.getHours().toString().padStart(2, "0"); // Format avec deux chiffres
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Retourner la date formatée
  return `${dayName} ${day} ${month} ${year} à ${hours}h${minutes}`;
}

function remplacerEspaces(url: string): string {
  return url.replace(/\s/g, "%20");
}
</script>

<style scoped>
@media (max-width: 812px) {
  .creneauRdv {
    font-size: 0.8em;
  }
}

@media (min-width: 812px) {
  .creneauRdv > p {
    padding-left: 2em;
    padding-right: 2em;
    padding-top: 1em;
    padding-bottom: 1em;
    width: 60%;
  }
}

.creneauRdv {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.creneauRdv > p {
  background-color: rgb(206, 206, 206);
  height: 3em;
  text-align: center;
  align-content: center;
  padding: 1em;
}

.creneauRdv > p:hover {
  background-color: rgb(192, 192, 192);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #979797;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Animation du spinner */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Pop-in */
.popin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.popin-content {
  background: rgb(206, 206, 206);
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

.popin-content h2 {
  margin-bottom: 15px;
}

.popin-content button {
  padding: 10px 20px;
  background-color: #125ed6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popin-content button:hover {
  background-color: #2980b9;
}
</style>

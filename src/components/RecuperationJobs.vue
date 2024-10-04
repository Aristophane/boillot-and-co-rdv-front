<template>
  <div class="jobsRecuperationContainer">
    <h2>
      Planifiez l'intervention de nos équipes à l'heure qui vous convient le
      mieux
    </h2>
    <h3>
      Afin de retrouver vos interventions veuillez insérer votre numéro de
      téléphone et le code postal du logement où se déroulera l'intervention
    </h3>
    <div className="flexColumn">
      <div class="flexRow">
        <label class="phoneClass" for="phone">Numéro de téléphone: </label>
        <input
          class="clientInput"
          type="tel"
          id="clientPhone"
          v-model="phone"
          name="phone"
          pattern="^(?:\+|00)?(?:[0-9]{2})?\s?[0-9]{1,2}(\s?[0-9]{2}){4,5}$"
          placeholder="+33102030405"
          required
        />
      </div>
      <div id="postCode" class="flexRow">
        <label class="postCodeClass" for="postcode">Code postal: </label>
        <input
          class="clientInput"
          type="text"
          v-model="postcode"
          name="postcode"
          pattern="[0-9]{5}"
          placeholder="75001"
          required
        />
        <br />
      </div>
    </div>
    <button class="buttonValider" @click="fetchData" :disabled="isJobsLoading">
      {{ isJobsLoading ? "Chargement..." : "Valider" }}
    </button>
    <div v-if="isJobsLoading" class="loader">Chargement des interventions</div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <div v-if="isJobsVisible">
      <h3>Liste des jobs à planifier:</h3>
      <Jobs
        @relay-job-scheduled="fetchData"
        @jobs-mounted="jobsMounted"
        :jobs="jobsReceived"
      ></Jobs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import Jobs from "./Jobs.vue";
import { scrollToElementById } from "../common/utils";
import { Job, ResponseDataForJobs } from "../types/JobTypes";

const isJobsVisible = ref<boolean>(false);
const isJobsLoading = ref(false);
const phone = ref<string>("");
const postcode = ref<string>("");
const error = ref<string | null>(null);
const data: Ref<ResponseDataForJobs | undefined> = ref<
  ResponseDataForJobs | undefined
>();
const jobsReceived = ref<Job[]>([]);
const getJobsListApiUrl = `/.netlify/functions/get-list-of-jobs-from-phone-and-postcode`;

const fetchData = async () => {
  isJobsLoading.value = true;
  isJobsVisible.value = false;
  error.value = null;

  try {
    if (postcode.value.length == 0) {
      throw new Error(`Merci d'indiquer le code postal de l'habitation`);
    }
    const cleanedPhone = formatFrenchPhoneNumber(phone.value);
    const params = new URLSearchParams({
      phone: cleanedPhone,
      postCode: postcode.value,
    });
    const response = await fetch(`${getJobsListApiUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`Nous n'avons pas pu identifier votre compte client, merci de nous contacter par téléphone`);
    }

    data.value = await response.json();
    const result = data.value;
    if (result !== undefined) {
      if (result.responseForJobs?.Result == "No results") {
        error.value = "Pas de travaux à planifier";
      } else {
        isJobsVisible.value = true;
        jobsReceived.value = result.responseForJobs.Result as Job[];
      }
    } else {
      error.value = "Erreur lors de la récupération des Jobs";
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isJobsLoading.value = false;
  }
};

const jobsMounted = () => {
  scrollToElementById("jobs");
};

function formatFrenchPhoneNumber(phoneNumber: string): string {
  // Supprimer tous les espaces, tirets, points et parenthèses
  let cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, "");

  // Vérifier si le numéro commence par "00" (indicatif international)
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // Vérifier si le numéro commence par "+"
  if (cleaned.startsWith("+")) {
    // Si c'est déjà en format international, vérifier que c'est bien français
    if (cleaned.startsWith("+33")) {
      return cleaned;
    } else {
      throw new Error("Ce numéro n'est pas un numéro français.");
    }
  }

  // Vérifier si le numéro commence par un "0" (indicatif national français)
  if (cleaned.startsWith("0")) {
    cleaned = "+33" + cleaned.slice(1);
  } else {
    throw new Error("Numéro non valide. Il doit commencer par '0' ou '+33'.");
  }

  // Vérifier que le numéro est bien de longueur correcte après transformation
  if (cleaned.length !== 12) {
    throw new Error(
      "Le numéro doit contenir 9 chiffres après l'indicatif '+33'."
    );
  }

  return cleaned;
}
</script>

<style scoped>
.phoneClass,
.postCodeClass {
  margin-right: 1em;
}

body {
  font-family: "Swiss", sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
}
h1 {
  color: #b3b3b3;
}
button {
  background-color: #125ed6;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 2em 2em;
  cursor: pointer;
}
p {
  font-size: 14px;
  color: #666;
}

.flexColumn {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 2em;
}

.flexRow {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.loader {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

@media (min-width: 812px) {
  .jobsRecuperationContainer {
    margin-left: 15%;
    margin-right: 15%;
  }
}

@media (max-width: 811px) {
  #postcode > label,
  input {
    width: 100%;
  }
}

.buttonValider {
  transition: transform 0.2s ease-in-out;
}

.buttonValider:hover {
  transform: scale(1.1);
}

.jobsRecuperationContainer {
  margin-bottom: 5em;
}

.clientInput {
  height: 2em;
}

input[type="text"] {
  width: 30%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  text-align: center;
  border-radius: 25px;
  background-color: #f9f9f9;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus {
  border-color: #125ed6; /* Couleur lors du focus */
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.4);
  background-color: #fff;
}

/* Style du placeholder */
input[type="text"]::placeholder {
  text-align: center; /* Centre le texte horizontalement */
}

input[type="tel"] {
  width: 30%;
  padding: 12px 20px;
  margin: 8px 0;
  text-align: center;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 25px;
  background-color: #f9f9f9;
  font-size: 16px;
  min-width: 153px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="tel"]:focus {
  border-color: #125ed6; /* Couleur lors du focus */
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.4);
  background-color: #fff;
}

/* Style du placeholder */
input[type="tel"]::placeholder {
  text-align: center; /* Centre le texte horizontalement */
}
</style>

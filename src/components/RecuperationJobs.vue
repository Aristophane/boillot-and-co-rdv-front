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
    <div className="flexRow">
      <div>
        <label for="phone">Numéro de téléphone : </label>
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
        <p>Entrez votre numéro de téléphone</p>
      </div>
      <div>
        <label for="postcode">Code postal : </label>
        <input
          class="clientInput"
          type="text"
          id="postcode"
          v-model="postcode"
          name="postcode"
          pattern="[0-9]{5}"
          placeholder="75001"
          required
        />
        <br />
        <p>Entrez le code postal de votre location</p>
      </div>
    </div>
    <button @click="fetchData" :disabled="isJobsLoading">
      {{ isJobsLoading ? "Chargement..." : "Valider" }}
    </button>
    <div v-if="isJobsLoading" class="loader">Chargement des interventions</div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <div v-if="isJobsVisible">
      <h3>Liste des jobs à planifier:</h3>
      <Jobs :jobs="jobsReceived"></Jobs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import Jobs from "./Jobs.vue";
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

  try {
    const cleanedPhone = cleanPhoneNumber(phone.value);
    const params = new URLSearchParams({
      phone: cleanedPhone,
      postCode: postcode.value,
    });
    const response = await fetch(`${getJobsListApiUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }

    data.value = await response.json();
    isJobsVisible.value = true;
    const result = data.value;
    if (result !== undefined) {
      jobsReceived.value = result.responseForJobs.Result;
    } else error.value = null;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isJobsLoading.value = false;
  }
};

const replacePlusWithEncodedPlus = (inputString: string): string => {
  return inputString.replace(/\+/g, "%2B");
};

const cleanPhoneNumber = (phoneInput: string): string => {
  const phonePattern = /^0(6|7)(\d{8})$/;

  // Teste si le numéro correspond au pattern
  const match = phoneInput.match(phonePattern);

  if (match) {
    // Remplace le 0 initial par +33 pour transformer en numéro international
    var result = `+33${match[1]}${match[2]}`;
    return replacePlusWithEncodedPlus(result);
  } else {
    throw new Error(
      "Le numéro de téléphone n'est pas au format 06xxxxxxxx ou 07xxxxxxxx ou +336xxxxxxxx ou ou +337xxxxxxxx"
    );
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
}
h1 {
  color: #b3b3b3;
}
button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 0;
  cursor: pointer;
}
p {
  font-size: 14px;
  color: #666;
}

.flexRow {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 2em;
}

.loader {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.jobsRecuperationContainer {
  margin-left: 15%;
  margin-right: 15%;
}

.clientInput {
  height: 2em;
}
</style>

<template>
  <div class="jobsRecuperationContainer">
    <h2>
      Planifiez l'intervention de nos équipes à l'heure qui vous
      convient le mieux
    </h2>
    <h3>
      Afin de retrouver vos intervention veuillez insérer votre numéro de
      téléphone et le code postal du logement ou se déroulera l'intervention
    </h3>
    <div className="flexRow">
      <div>
        <label for="phone">Numéro de téléphone : </label>
        <input
          type="tel"
          id="clientPhone"
          v-model="phone"
          name="phone"
          pattern="\+[0-9]{10,15}"
          placeholder="+33102030405"
          required
        />
        <p>Entrez un numéro de téléphone à 10 chiffres</p>
      </div>
      <div>
        <label for="postcode">Code postal : </label>
        <input
          type="text"
          id="postcode"
          v-model="postcode"
          name="postcode"
          pattern="[0-9]{5}"
          placeholder="75001"
          required
        />
        <br />
        <p>Entrez un code postal à 5 chiffres</p>
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
const replacePlusWithEncodedPlus = (inputString: string): string => {
  return inputString.replace(/\+/g, "%2B");
};

const fetchData = async () => {
  isJobsLoading.value = true;
  const getJobsListApiUrl = `/.netlify/functions/get-list-of-jobs-from-phone-and-postcode`;

  const cleanedPhone = replacePlusWithEncodedPlus(phone.value);
  const params = new URLSearchParams({
    phone: cleanedPhone,
    postCode: postcode.value,
  });

  try {
    const response = await fetch(`${getJobsListApiUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }

    data.value = await response.json();
    isJobsVisible.value = true;
    const result = data.value;
    if (result !== undefined) {
      jobsReceived.value = result.responseForJobs.Result;
    }

    error.value = null;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isJobsLoading.value = false;
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

.jobsRecuperationContainer{
  margin-left: 15%;
  margin-right: 15%;
}
</style>

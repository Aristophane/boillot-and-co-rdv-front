<template>
  <div>
    <h1>Prenez Rendez-Vous</h1>
    <h3>
      Planifiez l'intervention des équipes Boillot & Co, à l'heure qui vous
      convient le mieux
    </h3>
    <p>
      Afin de retrouver vos intervention veuillez insérer votre numéro de
      téléphone et le code postal du logement ou se déroulera l'intervention
    </p>
    <label for="phone">Numéro de téléphone :</label>
    <input
      type="tel"
      id="clientPhone"
      v-model="phone"
      name="phone"
      pattern="\+[0-9]{10,15}"
      placeholder="+33102030405"
      required
    />
    <br />
    <p>Entrez un numéro de téléphone à 10 chiffres</p>
    <br /><br />

    <label for="postcode">Code postal :</label>
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
    <br /><br />

    <button @click="fetchData">Valider</button>
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
  const apiUrl = `/.netlify/functions/get-list-of-jobs-from-phone-and-postcode`;

  const cleanedPhone = replacePlusWithEncodedPlus(phone.value);
  const params = new URLSearchParams({
    phone: cleanedPhone,
    postCode: postcode.value,
  });

  try {
    const response = await fetch(`${apiUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }

    data.value = await response.json();
    isJobsVisible.value = true;
    const result = data.value;
    if (result !== undefined) {
      jobsReceived.value = result.responseForJobs.Result;
    }
    console.log(
      "FRONT  jobsRECEIVED        ------" + JSON.stringify(jobsReceived.value)
    );
    error.value = null;
  } catch (err) {
    error.value = (err as Error).message;
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
</style>

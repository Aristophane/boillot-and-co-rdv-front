<template>
  <ul @click="selectJob" class="jobItem" v-for="job in jobs">
    <li>Job Ref : {{ job.Ref }}</li>
    <li>Job Id : {{ job.JobId }}</li>
    <li>Description : {{ job.Description }}</li>
    <li>Type : {{ job.Type }}</li>
    <li>Localisation : {{ job.Location }}</li>
  </ul>
</template>

<script setup lang="ts">
import { Job } from "../types/JobTypes";

defineProps<{ jobs: Job[] }>();

const selectJob = () =>{
  
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}

li{
  list-style-type: none;
}

.jobItem{
  background: #0087ff;
}

.jobItem:hover{
  background: #00e5ff;
}

</style>
